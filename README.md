# Requirements

## Install Prerequisites

1. **Visual Studio Code**

   - [Download here](https://code.visualstudio.com/download)

2. **Node.js**

   - [Download Node.js v22.14.0 (Windows x64)](https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi)

3. **Android Studio**

   - Required for the Android Emulator. Alternatively, you can use a physical Android device.

4. **Java Development Kit (JDK) version 23**
   - Make sure this is installed and set in your system `PATH`.

---

## Step 1: Navigate to User path (sample[ C:\Users\Bluewind> ])

> **Note:** If the emulator is not installed, install it via Android Studio.

Navigate to the Android SDK emulator path:

```
cd ~
```

## CLONE THE REPOSITORY inside the PS C:\Users\Bluewind>

```
git clone https://github.com/whitecatbeluga/workout-tracking-application
```

```
cd AppData\Local\Android\Sdk\emulator
```

List all available emulators if you dont have an emulator you to install it using android studio:

```
./emulator -list-avds
```

Run an emulator:

```
./emulator -avd Medium_Phone
# or
./emulator -avd Pixel_7_Pro
```

---

## Using WSL

List all available emulators from WSL:

```
/mnt/c/Users/Bluewind/AppData/Local/Android/Sdk/emulator/emulator.exe -list-avds
```

Run an emulator from WSL:

```
/mnt/c/Users/Bluewind/AppData/Local/Android/Sdk/emulator/emulator.exe -avd Medium_Phone
```

---

## Running the App on Android

> **Note:** You can also use your physical phone by scanning the QR code shown in the terminal using **Expo Go**.

```
npm run android
```

---

## Branching Guide to Avoid Conflicts

### Use the `beta` branch for development

> Do **not** use the `master` branch for development.

```
git checkout beta
```

---

### Creating a Feature Branch

1. Make sure you are on the `beta` branch:

```
git checkout beta
```

2. Pull the latest changes:

```
git pull
```

3. Create your feature branch (e.g., for home screen):

```
git checkout -b home-screen-branch
```

---

## Icons

You can browse available icons here:  
[https://icons.expo.fyi/](https://icons.expo.fyi/)

---

## Deleting Local Branches Except `master` and `beta`

> **Note:** This only works on Linux/macOS or Git (with `grep` installed).

```
git branch | grep -v "master" | grep -v "beta" | xargs git branch -D
```

To preserve additional branches, exclude them using `grep -v`:

```
git branch | grep -v "master" | grep -v "beta" | grep -v "your-branch" | xargs git branch -D
```
