import {State} from "../models/State";

const state1 = new State();
const state2 = new State();
const state3 = new State();
const state4 = new State();
state1.id = 1;
state2.id = 2;
state3.id = 3;
state4.id = 4;

export const MunicipalitySeed = [
    {
        name: "Municipio 1",
        dianCode: "323132",
        state: state1,
        status: true
    },
    {
        name: "Municipio 2",
        dianCode: "321321",
        state: state1,
        status: true
    },,
    {
        name: "Municipio 3",
        dianCode: "44444",
        state: state2,
        status: true
    },
    {
        name: "Municipio 4",
        dianCode: "55555",
        state: state2,
        status: true
    },
    {
        name: "Municipio 5",
        dianCode: "66666",
        state: state3,
        status: true
    },
    {
        name: "Municipio 6",
        dianCode: "77777",
        state: state3,
        status: true
    },
    {
        name: "Municipio 7",
        dianCode: "888888",
        state: state4,
        status: true
    },
    {
        name: "Municipio 8",
        dianCode: "99999",
        state: state4,
        status: true
    },
];
