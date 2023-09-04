import { Currency } from '../../../../entities/core/currency';

export type OmittedIDCurrency = Omit<Currency, "id">;
export type ExplictMongoID = { _id: string };
export type MongoIdCurrency = Currency & ExplictMongoID;