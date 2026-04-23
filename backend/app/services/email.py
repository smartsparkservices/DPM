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
