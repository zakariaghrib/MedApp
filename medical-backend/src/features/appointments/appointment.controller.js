const appointmentService = require('./appointment.service');

class AppointmentController {
  async getAll(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const appointments = await appointmentService.getAppointments(startDate, endDate);
      return res.status(200).json({
        success: true,
        data: appointments
      });
    } catch (error) {
      console.error('[AppointmentController] Error getting appointments:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req, res) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);
      return res.status(201).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error('[AppointmentController] Error creating appointment:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await appointmentService.updateStatus(id, status);
      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error('[AppointmentController] Error updating appointment:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateTime(req, res) {
    try {
      const { id } = req.params;
      const { dateTime } = req.body;
      const appointment = await appointmentService.updateTime(id, dateTime);
      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error('[AppointmentController] Error updating appointment time:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await appointmentService.deleteAppointment(id);
      return res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      console.error('[AppointmentController] Error deleting appointment:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AppointmentController();
