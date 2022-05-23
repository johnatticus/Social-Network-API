const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
// const dateFormat = require('../utils/dateFormat');

const dateFormat = (date) => {
    return date.toLocaleString();
  };

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
            type: Date,
            // get: timestamp => dateFormat(timestamp),
            default: Date.now(),
            get: dateFormat,

        },
        reactions: [reactionSchema],
    },
    {
        // timestamps: true,
        toJSON: {
            getters: true
        },
        id: false
    }
)

// virtual that displays the amount of reactions a thought has
thoughtSchema.virtual('amountOfReactions').get(function () {
    return this.reactions.length;
  });

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;