# recurrly

Subscription tracking for people who want a clearer view of recurring spending.

## Authentication setup

This app uses a custom email and password flow powered by Clerk. It supports account creation with email verification, sign-in, password recovery, email-code device verification, and email-code MFA.

1. Create a Clerk application and enable:
   - Sign-up with email and password
   - Sign-in with email and password
   - Email verification codes
   - Email-code MFA or device trust if those features are enabled for your instance
2. Copy the publishable key into `.env`:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
   ```

   Use `.env.example` as the template. The local `.env` is ignored by git.
3. Install dependencies and start Expo:

   ```bash
   npm install
   npx expo start
   ```

The current custom UI intentionally supports email identifiers only. Phone/SMS authentication, social providers, TOTP, backup codes, and organization selection require additional dedicated screens and are not enabled by this implementation.

## Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Reset the starter project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
