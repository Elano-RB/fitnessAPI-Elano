const Workout = require("../models/Workout");

module.exports.addWorkout = async (req, res) => {
    try {
        const { name, duration } = req.body;

        if (!name || !duration) {
            return res.status(400).send({ message: "Missing fields" });
        }

        const workout = await Workout.create({
            userId: req.user.id,
            name,
            duration,
            status: "pending",
            dateAdded: new Date()
        });

        return res.status(201).send(workout);

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};


module.exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id });

        return res.status(200).send({workouts: workouts});

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports.updateWorkout = async (req, res) => {
    try {
        const workoutId = req.params.workoutId; // get from URL

        const updated = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).send({ message: "Workout not found" });

        return res.status(200).send({
            message: "Workout updated successfully",
            updatedWorkout: updated
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};


module.exports.deleteWorkout = async (req, res) => {
    try {
        const workoutId = req.params.workoutId;

        const deleted = await Workout.findOneAndDelete({
            _id: workoutId,
            userId: req.user.id
        });

        if (!deleted)
            return res.status(404).send({ message: "Workout not found" });

        return res.status(200).send({
            message: "Workout deleted successfully"
            // deletedWorkout: deleted
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};


module.exports.completeWorkoutStatus = async (req, res) => {
    try {
        const workoutId = req.params.workoutId; // get ID from URL

        const updated = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id },
            { status: "completed" },
            { new: true }
        );

        if (!updated)
            return res.status(404).send({ message: "Workout not found" });

        return res.status(200).send({
            message: "Workout status updated successfully",
            updatedWorkout: updated
        });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

