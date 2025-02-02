
# Islamic Calendar Telegram Mini App

A Telegram Mini App that provides Islamic calendar features, including Ramadan dates, prayer times, and notifications for upcoming prayer times.

## Features

- **Islamic Calendar** - Displays important dates such as Ramadan.
- **Prayer Times** - Displays daily prayer times based on user location.
- **Notifications** - Sends notifications when prayer time is approaching.

## Installation & Setup

To run the application locally, follow these steps:

### 1. Clone the repository

```bash
git clone git@github.com:jinnyMcKindy/islamic_calendar.git
cd islamic_calendar
```

### 2. Install dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory of the project and copy the contents from `env.example`. Ensure that you fill in the necessary values.

```bash
cp env.example .env
```

### 4. Run the app

Start the application in development mode using:

```bash
npm run dev
```

The app will now be running locally. You can test it by opening your Telegram and interacting with the Mini App.

## Additional Notes

- Ensure you have a valid Telegram Bot token and API access for the app to work correctly.
- The app relies on geolocation for prayer times, so make sure the Telegram Mini App is granted location permissions.
- You can use the free trial and then switch to the paid subscription for premium features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
