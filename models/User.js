const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // match: look up regex ("Must be an email address")
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// virtual that displays the amount of friends a user has
userSchema.virtual('amountOfFriends').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
