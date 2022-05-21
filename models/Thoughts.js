const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            // FILL OUT
            type: String,
            required: true,
            minlength: 1,
            maxlength: 250,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            // get: timestamp => dateFormat(timestamp)
            type: Date,
            default: Date.now,
        },
        reactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Reaction',
            }
        ],
        user: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ]
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
)
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;