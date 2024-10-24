const SchedulePickup = require("../models/SchedulePickupModel");

class SchedulePickupService {
  static async addSchedulePickup(area, date, collector, locations, quantity) {
    try {
      const newSchedulePickup = new SchedulePickup({
        area,
        date,
        collector,
        locations,
        quantity,
      });
      await newSchedulePickup.save();
      return {
        success: true,
        message: "Added New Schedule Pickup successfully",
      };
    } catch (error) {
      console.error("Error in SchedulePickupService.addSchedulePickup:", error);
      return {
        success: false,
        message: "Error Adding New Schedule",
      };
    }
  }

  static async getSchedulePickup() {
    try {
      const shedulepickups = await SchedulePickup.find({});
      if (!shedulepickups) {
        return { success: false, message: "No Smartbin found" };
      }

      return {
        success: true,
        shedulepickups: shedulepickups.map((shedulepickup) => ({
          _id: shedulepickup._id,
          area: shedulepickup.area,
          date: shedulepickup.date,
          collector: shedulepickup.collector,
          status: shedulepickup.status,
          locations: shedulepickup.locations,
          quantity: shedulepickup.quantity,
        })),
      };
    } catch (error) {
      console.error("Error while fetching smartbin details:", error);
      throw new Error("Error while fetching smartbin details");
    }
  }

  static async getSchedulePickupToCollector({ collector }) {
    try {
      const schedulePickups = await SchedulePickup.find({ collector });
      if (!schedulePickups || schedulePickups.length === 0) {
        return { success: false, message: "No schedule pickups found" };
      }

      return {
        success: true,
        schedulePickups: schedulePickups.map((pickup) => ({
          id: pickup._id,
          area: pickup.area,
          date: pickup.date,
          collector: pickup.collector,
          status: pickup.status,
          locations: pickup.locations,
          quantity: pickup.quantity,
        })),
      };
    } catch (error) {
      console.error("Error while fetching schedule pickups:", error);
      throw new Error("Error while fetching schedule pickups");
    }
  }

  static async updateScheduleLocationInPickup(
    schedulePickupId,
    locationId,
    wasteTypes
  ) {
    try {
      // Use MongoDB's arrayFilters to update only the specific location in the array
      const result = await SchedulePickup.findOneAndUpdate(
        { _id: schedulePickupId, "locations.id": locationId }, // Find the schedule and the specific location
        {
          $set: {
            "locations.$.WasteType": wasteTypes, // Update the WasteType array
            "locations.$.ScheduleState": "Completed", // Update status to 'Completed'
          },
        }, // Update the WasteType for the matched location
        { new: true } // Return the updated document
      );

      if (!result) {
        return { success: false, message: "Schedule or location not found" };
      }

      return {
        success: true,
        message: "Location's waste types updated successfully",
      };
    } catch (error) {
      console.error(
        "Error while updating location waste types:",
        error.message
      );
      return {
        success: false,
        message: "Error while updating location waste types: " + error.message,
      };
    }
  }

  static async startSchedulePickup(id) {
    try {

      const schedule = await SchedulePickup.findOne({ _id: id });
      if (!schedule) {
        return { success: false, message: "Schedule not found" };
      }

      // Log the data being updated for debugging
      console.log("Updating schedule:", {
        id
      });

      // update and save schedule
      schedule.status = "Started";
      await schedule.save();

      return { success: true, message: "Schedule updated successfully" };

    } catch (error) {
      console.error("Error while updating Schedule:", error.message);
      return { success: false, message: "Error while updating Schedule: " + error.message };
    }
  }

  static async finishSchedulePickup(id) {
    try {

      const schedule = await SchedulePickup.findOne({ _id: id });
      if (!schedule) {
        return { success: false, message: "Schedule not found" };
      }

      // Log the data being updated for debugging
      console.log("Updating schedule:", {
        id
      });

      // update and save schedule
      schedule.status = "Finished";
      await schedule.save();

      return { success: true, message: "Schedule updated successfully" };

    } catch (error) {
      console.error("Error while updating Schedule:", error.message);
      return { success: false, message: "Error while updating Schedule: " + error.message };
    }
  }

  static async deleteSchedulePickup(_id) {
    try {
      const deletedSchedulePickup = await SchedulePickup.findByIdAndDelete(_id);

      if (!deletedSchedulePickup) {
        return { success: false, message: "SchedulePickup not found" };
      }

      return { success: true, message: "SchedulePickup deleted successfully" };
    } catch (error) {
      console.error("Error while deleting SchedulePickup:", error);
      throw new Error("Error while deleting SchedulePickup");
    }
  }
}






module.exports = SchedulePickupService;
