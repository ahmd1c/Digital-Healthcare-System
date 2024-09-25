# Overview

Welcome to our cutting-edge healthcare platform, designed to streamline the interactions between patients and healthcare providers. Our application offers seamless appointment scheduling, real-time communication, and secure medical data management. With support for telemedicine and traditional visits, this app is a modern solution for patients and doctors alike. Leveraging real-time socket communication and advanced WebRTC technology, we ensure smooth and efficient interactions in every step of the healthcare journey.

##### important !! : This is only test app not for real world use , as in production medical data must be encrypted and comply with appropriate regulations#####

# Features

### 1. **Authentication & Authorization**

- Secure user authentication and role-based access control ensure that only authorized personnel (admin, doctor, patient) can access specific features.

### 2. **Flexible Timeslot Management**

- Doctors have the ability to create and manage flexible timeslots based on their availability. Whether recurrent or single, timeslots can be easily adjusted to meet both the doctor’s and patient’s needs.

### 3. **Appointment Scheduling**

- Patients can schedule appointments of two types:
  - **In-person visits**
  - **Telemedicine sessions** (for remote consultations)

### 4. **Real-time WebRTC Signaling**

- The application integrates a **Socket Gateway** to handle WebRTC signaling, enabling secure and stable connections for telemedicine video calls.

### 5. **Chat Features**

- Integrated chat functionality using **Socket.IO** allows for real-time messaging between doctors and patients. Whether during a telemedicine session or in general communication, the chat ensures smooth interactions.

### 6. **Comprehensive Medical Records**

- Each patient has a dedicated medical record, which includes:
  - **Medical history**
  - **Medications**
- This feature provides doctors with crucial background information to offer informed consultations.

### 7. **Prescription Management**

- Doctors can issue prescriptions for patients after appointments. These prescriptions are securely stored and accessible to the patient for future reference.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Auth Module

The Auth module handles all authentication-related features such as user registration, login, logout, and password management. It also includes functionality for token refresh, verification, and sending OTPs.

#### Supports access token and refresh token either via Bearer authorization header or cookies

## Endpoints

### 1. Register

**POST** `/auth/register`

Registers a new user.

#### Request Body:

```json
{
  "name": string,
  "email": string,
  "password": string,
  "gender": string,
  "accType": string,
  "address": string,
}
```

accType is enum ("doctor" , "patient") , and based on the accType you will need to provide more information.

#### Patient :

```json
{
  "marital_status": string,
  "occupation": string,
  "nationality": string,
  "emergency_phone": string,
  "date_of_birth": Date
}
```

#### Doctor :

```json
{
  "specialization": string,
  "schedule_price": number,
  "schedule_duration": number,
  "education": {
    "degree": string,
    "institution": string,
    "year": number
  }[]
}
```

#### example of doctor registration :

```json
{
  "name": "testpatient",
  "email": "testpatient@gmail.com",
  "password": "testpatient",
  "address": "alexandria,Egypt",
  "phone": "+201234567892",
  "accType": "patient",
  "gender": "M",
  "patient": {
    "marital_status": "single",
    "occupation": "engineer",
    "nationality": "Egyptian",
    "emergency_phone": "+201111111112",
    "date_of_birth": "2000-11-11"
  }
}
```

#### Response :

- 201 Created :

##### Email with otp code will be sent to email for email verification.

```json
{
  "accessToken" : string,
  "refreshToken" : string,
  "user" : {
    "name": string,
    "email": string,
    "gender": string,
    "accType": string,
    "address": string,
    "patient?" : Patient,
    "doctor?" : Doctor
  },
  "message": string
}
```

Based on the accType the object Patient or Doctor will return.

- 400 Bad Request: Validation error.

### 2. Login

**POST** `/auth/login`

#### Request body :

```json
{
  "email" : string,
  "password" : string
}
```

#### Response :

- 200 successful :

```json
  {
    "accessToken" : string,
    "refreshToken" : string
  }
```

- 401 Unauthorized: Invalid credentials.

### 3. Refresh token :

**POST** `/auth/refresh`

#### Request Header :

```bash
cookies? : refresh_token,
authorization? : Refresh <token>
```

#### Response :

- 200 Successful :

```json
{
  "accessToken" : string,
  "refreshToken" : string
}
```

- 401 Unauthorized: Invalid refresh token.

### 4. Verify :

**POST** `/auth/verify`

#### Request body :

```json
{
  "email" : string,
  "otp" : string
}
```

#### Response :

- 200 Successful :

```json
{
  "message" : string
}
```

- 400 Bad Request: Invalid token.

### 5. Send Email Otp :

**POST** `/auth/send-email-otp`

#### Request body :

```json
{
  "email" : string,
}
```

#### Response :

- 200 Successful :

##### Email will sent with new otp.

```json
{
  "message" : string
}
```

- 404 Not Found: Email not found.

### 6. Send Email Otp :

**POST** `/auth/refresh`

#### Response :

- 200 Successful :

```json
{
  "accessToken" : string,
  "refreshToken" : string
}
```

- 401 Unauthorized: Invalid refresh token.

### 7. Forget password :

**POST** `/auth/forgot-password`

#### Request body :

```json
{
  "email" : string
}
```

#### Response :

- 200 Successful :

##### Email will sent with password reset link.

```json
{
  "message" : string
}
```

### 8. reset password :

**PATCH** `/auth/reset-password`

#### Request body :

```json
{
  "userId" : number,
  "token" : string,
  "password" : string
}
```

#### Response :

- 200 Successful :

```json
{
  "message" : string
}
```

- 400 Bad Request: Invalid token or weak password.

### 9. change password :

**PATCH** `/auth/change-password`

#### Request body :

```json
{
  "oldPassword" : string,
  "newPassword" : string
}
```

#### Response :

- 200 Successful :

```json
{
  "message" : string
}
```

- 400 Bad Request: Invalid old password or weak new password.

### 10. logout :

**POST** `/auth/logout`

#### Response :

- 200 Successful :

```json
{
  "message" : string
}
```

# Appointment Module

The Appointment module handles the creation, retrieval, updating, confirmation, and cancellation of appointments. Role-based access control is enforced for certain actions, allowing only admin and doctor users to perform sensitive operations like confirming appointments.

## Endpoints

### 1. Create Appointment

**POST** `/appointments`

Creates a new appointment.

#### Request Body:

```json
{
  "type": string, // ("visit" or "telemedicine)
  "doc_id": number,
  "patient_id": number,
  "date": YYYY-MM-DD,
  "timeslot_id": number
}
```

#### Respone :

- 201 Successfully created

```json
{
  "message" : string,
  "appointment" : {
    "id": number,
    "type": string,
    "doc_id": number,
    "patient_id": number,
    "date": YYYY-MM-DD,
    "timeslot_id": number,
    "status": pending
  }
}
```

- 400 Valdiation Error
- 409 Conflict Error : either doctor or patient have appointment in this timeslot

### 2. Get All Appointments

**GET** `/appointments`

Fetches a list of all appointments.

#### Request :

##### query params :

```bash
doc_id? : number,
patient_id? : number
```

#### For non admin users it will return their appointments

#### Response :

- 200 OK:

```json
{
  "message" : string,
  "appointments" : Appointment[]
}
```

- 403 UnAuthenticated Error

### 3. Get Appointment by ID

**GET** `/appointments/:id`

Fetches details of a specific appointment by its ID.

#### Response :

- 200 OK:

```json
{
  "message" : string,
  "appointments" : Appointment
}
```

- 403 UnAuthorized Error
- 404 Not Found Error

### 4. Update Appointment by ID

**PATCH** `/appointments/:id`

#### Request Body:

```json
{
  "type?": string, // ("visit" or "telemedicine)
  "date?": YYYY-MM-DD,
  "timeslot_id?": number
}
```

#### Response :

- 200 OK:

```json
{
  "message" : string,
}
```

- 400 Validation Error
- 403 UnAuthorized Error
- 404 Not Found Error

### 5. Confirm Appointment

**PATCH** `/appointments/:id/confirm`

Confirms an appointment, changing its status to confirmed. This action is restricted to users with the admin or doctor role.

#### Response:

- 200 OK: Appointment confirmed :

```json
{
  "success": true,
  "message" : string
}
```

- 403 Forbidden: User not authorized.
- 404 Not Found: Appointment not found.

### 6. Cancel Appointment

**PATCH** `/appointments/:id/cancel`

Cancels an appointment, changing its status to cancelled.

#### Response:

- 200 OK: Appointment cancelled :

```json
{
  "success": true,
  "message" : string
}
```

- 403 Forbidden: User not authorized.
- 404 Not Found: Appointment not found.

# Doctor Timeslot Module

The Doctor Timeslot module allows doctors and admins to manage the availability of doctors through timeslots. It supports creating, retrieving, updating, and deleting timeslots, with role-based and owner-specific access control.

## Data Model

### Timeslot DTO

Represents the structure of a timeslot.

- **start_time**: `string` - The start time of the timeslot in `HH:MM` format.
- **end_time**: `string` - The end time of the timeslot in `HH:MM` format.
- **type**: `string` - Type of timeslot, either `single`, `recurrent`, or `unavailable`.
- **days**: `number[]` (optional) - Days of the week for recurrent timeslots, with values from 1 (Monday) to 7 (Sunday). Required if the type is `recurrent`.
- **date**: `Date` (Required if type is `single` or `unavailable`) - The specific date for `single` or `unavailable` timeslots in `YYYY-MM-DD` format.

## Endpoints

### 1. Create Timeslot

**POST** `/doctors/:id/timeslots`

Creates a new timeslot for the specified doctor. This route is restricted to users with the `admin` or `doctor` role and requires owner access (guarded by `OwnerGuard`).

#### Request Body:

```json
{
  "start_time": "HH:MM",
  "end_time": "HH:MM",
  "type": "single | recurrent | unavailable",
  "days": (0-7)[],  // optional, required if type is recurrent
  "date": "YYYY-MM-DD"  // optional, required if type is single or unavailable
}
```

#### Response:

- 201 Created :

```json
{
  "id": "number",
  "doctor_id": "number",
  "start_time": "HH:MM",
  "end_time": "HH:MM",
  "type": "single | recurrent | unavailable",
  "days": (0-7)[],  // optional
  "date": "YYYY-MM-DD",  // optional
  "status": "available"
}
```

- 400 Bad Request : Validation error.
- 403 Forbidden: Unauthorized access.

### 2. Get All Timeslots

**GET** `/doctors/:id/timeslots`

Retrieves all timeslots for the specified doctor. This route is public.

#### Response:

- 200 OK:

```json
[
  {
    "id": "number",
    "start_time": "HH:MM",
    "end_time": "HH:MM",
    "type": "single | recurrent | unavailable",
    "days": (1-7)[],  // optional
    "date": "YYYY-MM-DD",  // optional
    "status": "available"
  },
  ...
]
```

### 3. Get Timeslot by ID

**GET** /doctors/:id/timeslots/:slotId

Fetches details of a specific timeslot by its ID.

#### Response:

- 200 OK:

```json
{
  "id": "number",
  "start_time": "HH:MM",
  "end_time": "HH:MM",
  "type": "single | recurrent | unavailable",
  "days": (0-7)[],  // optional
  "date": "YYYY-MM-DD",  // optional
  "status": "available"
}
```

- 404 Not Found: Timeslot not found.

### 4. Update Timeslot

**PATCH** `/doctors/:id/timeslots/:slotId`

Updates details of a specific timeslot. This route is restricted to users with the admin or doctor role and requires owner access (guarded by OwnerGuard).

#### Request Body:

```json
{
  "start_time?": "HH:MM",
  "end_time?": "HH:MM",
  "type?": "single | recurrent | unavailable",
  "days?": (0-7)[],  // optional, required if type is recurrent
  "date?": "YYYY-MM-DD"  // optional, required if type is single or unavailable
}
```

#### Response:

- 200 OK: Timeslot updated.
- 400 Bad Request: Validation error.
- 403 Forbidden: Unauthorized access.
- 404 Not Found: Timeslot not found.

```json
{
  "success" : boolean
}
```

### 5. Delete Timeslot

**DELETE** `/doctors/:id/timeslots/:slotId`

Deletes a specific timeslot. This route is restricted to users with the admin or doctor role and requires owner access (guarded by OwnerGuard).

#### Response:

- 200 OK: Timeslot deleted.
- 403 Forbidden: Unauthorized access.
- 404 Not Found: Timeslot not found.

```json
{
  "success" : boolean,
  "message" : string
}
```

<hr>
<br>

- **Users** ,
- **Doctors** ,
- **Patients** ,
- **Prescriptions** ,
- **Medical records** ,
- **Medical history** ,
- **Patient medications** ,
- **Chat , Messages**

#### will be documented soon
