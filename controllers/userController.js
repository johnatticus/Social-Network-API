const { ObjectId } = require('mongoose').Types;
const { User, Thoughts } = require('../models');

// counts total amount of users. Not sure why I have this.
const userCount = async () =>
    User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);

const userController = {

    // get all users...WORKS
    getUsers(req, res) {
        User.find()
        .select('-__v')
        .then(async (users) => {
            const userObj = {
            users,
            userCount: await userCount(),
            };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    // get a user by id...WORKS
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean()
        .then(async (user) =>
            !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json({
                user,
                })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },
    // create a new user...WORKS
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // Delete a user...WORKS....killed server when trying to delete attached thoughts
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        // .then((user) =>
        //     !user
        //     ? res.status(404).json({ message: 'No such user exists' })
        //     : Thought.deleteMany(
        //         { _id: { $in: user.thought } },
        //         // { $pull: { username: req.body.username } },
        //         { new: true }
        //         )
        // )
        .then((friends) =>
            !friends
            ? res.status(404).json({
                message: 'User deleted, but they had no friends. Sad.',
                })
            : res.json({ message: 'User successfully deleted' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Update a user...WORKS
    updateUser(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) =>
            !user
              ? res.status(404).json({ message: 'No user with this id!' })
              : res.json(user)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    // Add a friend...WORKS
    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res
                .status(404)
                .json({ message: 'No user found with that ID :(' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Delete a friend...WORKS
    removeFriend(req, res) {
        console.log('You are REMOVING a friend');
        console.log(req.params.friendId);
        User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { $in: req.params.friendId } } },
        { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res
                .status(404)
                .json({ message: 'No user found with that ID :(' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
}

module.exports = userController;