import {Schema, model, models} from "mongoose"

const AlternativeUser = new Schema({
    name: Schema.Types.String,
    email: Schema.Types.String,
    password: Schema.Types.String,
    // userId: Schema.Types.String
})

let alternativeUser = models.alternativeUser || model("alternativeUser", AlternativeUser)

export default alternativeUser