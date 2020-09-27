import { RequestHandler } from 'express';

import validator from 'validator'

import Knex from 'knex';
import knexConfig from "../config/knex"
import { attachPaginate } from 'knex-paginate'
attachPaginate();

import { TAyah, TAyahDetails, TQueryResult, IAyah, IQuran, IRandom, ISoorah } from "../config/types"

const knex = Knex(knexConfig);

const selectFields = {
  id: "q.id",
  s: "q.soorah_id",
  a: "q.aya_id",
  c: "q.content",
  t: "q.translator_id",
};

export const querySearch: RequestHandler<{ query: string }> = (req, res) => {

  const query: string = req.params.query.toString();
  const translator: number = Number(req.query.t) || 1;
  const page: number = Number(req.query.page) || 1;

  if (
    validator.isEmpty(query) &&
    !validator.isInt(translator.toString(), { min: 1, max: 4 }) ||
    !validator.isInt(page.toString(), { min: 1, max: 50 })
  ) {
    res.status(400).json("error");
  }

  const data = {
    s: null,
    a: null,
    q: query,
    t: translator,
    view: "search",
  };




  knex<IQuran>({ q: "qurans" })
    .select(selectFields)
    .where("q.content", "LIKE", `%${query}%`)
    .where({ translator_id: translator })
    .paginate({ perPage: 30, currentPage: page, isLengthAware: true })
    .then((result: TQueryResult) => {
      let output;

      if (result.data.length > 0) {
        output = { out: result.data, data: data, paginate: result.pagination };
      } else {
        output = { message: "Kəlmə tapılmamışdır", out: [], data: data };
      }
      res.status(200).json(output);
    })
    .catch((error: Error) => console.log(error));
}

export const soorahSearch: RequestHandler<{ soorah: number }> = (req, res, next) => {
  const soorah: number = Number(req.params.soorah);
  const translator: number = Number(req.query.t) || 1;

  if (
    !validator.isInt(soorah.toString(), { min: 1, max: 114 }) ||
    !validator.isInt(translator.toString(), { min: 1, max: 4 })
  ) {
    res.status(400).json("error");
  }

  const data = {
    s: soorah,
    a: null,
    q: null,
    t: translator,
    view: "soorah",
  };

  knex<ISoorah>({ q: "qurans" })
    .select(selectFields)
    .where({ soorah_id: soorah, translator_id: translator })
    .then((result: TAyah[]) => {
      let output;

      if (result.length > 0) {
        output = { out: result, data: data };
      } else {
        output = { message: "Surə tapılmamışdır", out: [], data: data };
      }
      res.status(200).json(output);
    });
}

export const ayahSearch: RequestHandler<{ soorah: number, ayah: number }> = (req, res) => {

  const soorah: number = Number(req.params.soorah);
  const ayah: number = Number(req.params.ayah);

  const translator: number = Number(req.query.t) || 1;

  if (
    !validator.isInt(soorah.toString(), { min: 1, max: 114 }) ||
    !validator.isInt(ayah.toString(), { min: 1, max: 286 }) ||
    !validator.isInt(translator.toString(), { min: 1, max: 4 })
  ) {
    res.status(400).json("error");
  }

  const data = {
    s: soorah,
    a: ayah,
    q: null,
    t: translator,
    view: "ayah",
  };

  const whereCondition = {
    "q.soorah_id": soorah,
    "q.translator_id": translator,
  };

  knex<IAyah>({ q: "qurans" })
    .select({
      ...selectFields,

      arabic: "details.content",
      transliteration: "details.transliteration",
      juz: "details.juz",

      prev: knex("qurans as q")
        .max("aya_id", { as: "prev" })
        .where(whereCondition)
        .where("q.aya_id", "<", ayah),
      next: knex("qurans as q")
        .min("aya_id", { as: "next" })
        .where(whereCondition)
        .where("q.aya_id", ">", ayah),
    })
    .where({ ...whereCondition, "q.aya_id": ayah })
    .join("details", "q.detail_id", "details.id")
    .then((result: TAyahDetails[]) => {
      let output;

      if (result.length > 0) {
        output = { out: result, data: data };
      } else {
        output = { message: "Ayə tapılmamışdır", out: [], data: data };
      }
      res.status(200).json(output);
    });
}

export const randomSearch: RequestHandler<{ limit: number, query: string }> = (req, res, next) => {
  const limit: number = Number(req.params.limit) || 1;
  const translator: number = Number(req.query.t) || 1;

  const query: string = req.params.query || "";

  if (
    !validator.isInt(translator.toString(), { min: 1, max: 4 }) ||
    !validator.isInt(limit.toString(), { min: 1, max: 10 })
  ) {
    res.status(400).json("error");
  }

  const data = {
    s: null,
    a: null,
    q: null,
    t: translator,
    view: "random",
  };

  const whereCondition = {
    translator_id: translator,
  };

  if (!validator.isEmpty(query) && query.length > 3) {
    knex<IRandom>({ q: "qurans" })
      .select(selectFields)
      .where(whereCondition)
      .where("content", "LIKE", `%${query}%`)
      .orderByRaw("RAND()")
      .limit(limit)
      .then((result: TAyah[]) => {
        let output;

        if (result.length > 0) {
          output = { out: result, data: { ...data, q: query } };
        } else {
          output = { message: "Ayə tapılmamışdır", out: [], data: data };
        }
        res.status(200).json(output);
      });
  } else {
    knex({ q: "qurans" })
      .select(selectFields)
      .where(whereCondition)
      .orderByRaw("RAND()")
      .limit(1)
      .first()
      .then((result: TAyah) => res.status(200).json({ out: result, data: data }));
  }
}