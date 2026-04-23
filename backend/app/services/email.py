import logging

import resend

from app.config import get_settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html: str) -> None:
    """Send an email via the Resend API. Failures are logged, not raised."""
    settings = get_settings()
    resend.api_key = settings.RESEND_API_KEY

    try:
        resend.Emails.send(
            {
                "from": settings.FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html,
            }
        )
        logger.info("Email sent to %s — %s", to, subject)
    except Exception:
        logger.exception("Failed to send email to %s", to)


def notify_admin_new_ride(
    patient_name: str,
    pickup: str,
    dropoff: str,
    appointment_time: str,
) -> None:
    """Send the admin an email when a new ride is booked."""
    settings = get_settings()
    html = f"""
    <h2>New Ride Request</h2>
    <p><strong>Patient:</strong> {patient_name}</p>
    <p><strong>Pickup:</strong> {pickup}</p>
    <p><strong>Destination:</strong> {dropoff}</p>
    <p><strong>Appointment Time:</strong> {appointment_time}</p>
    """
    send_email(settings.ADMIN_EMAIL, "New Ride Request", html)


def notify_customer_new_ride(
    to_email: str,
    patient_name: str,
    pickup: str,
    dropoff: str,
    appointment_time: str,
) -> None:
    """Send the customer an email when they submit a new ride request."""
    html = f"""
    <h2>Ride Request Received</h2>
    <p>Hi {patient_name},</p>
    <p>We have successfully received your ride request for <strong>{appointment_time}</strong>.</p>
    <p><strong>Pickup:</strong> {pickup}</p>
    <p><strong>Destination:</strong> {dropoff}</p>
    <p>We will contact you shortly to confirm your trip. Thank you for choosing Desert Path Mobility Services.</p>
    """
    send_email(to_email, "Ride Request Received", html)


def notify_customer_ride_scheduled(
    to_email: str,
    appointment_time: str,
    driver_name: str,
) -> None:
    """Send the customer a confirmation once their ride is scheduled."""
    html = f"""
    <h2>Ride Confirmed</h2>
    <p>Your ride has been scheduled for <strong>{appointment_time}</strong>.</p>
    <p>Driver: <strong>{driver_name or 'TBD'}</strong></p>
    <p>Thank you for choosing Desert Path Mobility Services.</p>
    """
    send_email(to_email, "Ride Confirmed", html)


def notify_customer_ride_cancelled(
    to_email: str,
    appointment_time: str,
) -> None:
    """Send the customer an email when their ride is cancelled."""
    html = f"""
    <h2>Ride Cancelled</h2>
    <p>Your ride scheduled for <strong>{appointment_time}</strong> has been cancelled.</p>
    <p>If you believe this is an error, please contact us at (623) 688-3533.</p>
    """
    send_email(to_email, "Ride Cancelled", html)


def notify_admin_ride_scheduled(
    patient_name: str,
    appointment_time: str,
    driver_name: str,
) -> None:
    """Send the admin an email when a ride is successfully scheduled."""
    settings = get_settings()
    html = f"""
    <h2>Ride Scheduled</h2>
    <p><strong>Patient:</strong> {patient_name}</p>
    <p><strong>Time:</strong> {appointment_time}</p>
    <p><strong>Driver Assigned:</strong> {driver_name or 'TBD'}</p>
    """
    send_email(settings.ADMIN_EMAIL, f"Ride Scheduled: {patient_name}", html)


def notify_admin_ride_cancelled(
    patient_name: str,
    appointment_time: str,
) -> None:
    """Send the admin an email when a ride is cancelled."""
    settings = get_settings()
    html = f"""
    <h2>Ride Cancelled</h2>
    <p><strong>Patient:</strong> {patient_name}</p>
    <p><strong>Original Time:</strong> {appointment_time}</p>
    <p>This ride has been marked as cancelled in the system.</p>
    """
    send_email(settings.ADMIN_EMAIL, f"Ride Cancelled: {patient_name}", html)
