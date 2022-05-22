const { User, Thought } = require("../models");

const thoughtController = {
    // get all thoughts..WORKS
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },
    // Get a thought by ID...WORKS
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select("-__v")
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: "No thought with that ID" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Create a thought...WORKS
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );
        })
        .then((user) =>
        !user
          ? res.status(404).json({
              message: 'No user with that ID',
            })
          : res.json('Thought created')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    },
    // Delete a thought...WORKS
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: "No thought with that ID" })
            : User.deleteMany({ _id: { $in: thought.user } })
        )
        .then(() => res.json({ message: "Thought and user deleted!" }))
        .catch((err) => res.status(500).json(err));
    },
    // Update a thought...WORKS
    updateThought(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: "No thought with this id!" })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Add a reaction....WORKS...but why _id and reactionId? and is it supposed to link to user?
    addReaction(req, res) {
        console.log('You are adding a reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Delete a reaction....does NOT work. yet.
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { $in: req.params.reactionId } } },
        { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res
                .status(404)
                .json({ message: 'No thought found with that ID :(' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtController;
