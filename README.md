# Requirements

Install node

Install android studio to get the Android Immulator or you can use your phone

Install java version 23

## Step1 : You must navigate first to

Note: If you haven't installed it yet install it on android studio

```
C:\Users\Bluewind\AppData\Local\Android\Sdk\emulator>
```

Then list all the emulator installed

```
./emulator -list-avds
```

Run the Immulator

```
./emulator -avd Medium_Phone_API_36
```

If your using WSL (list all the emulator installed in your machine)

```
/mnt/c/Users/Bluewind/AppData/Local/Android/Sdk/emulator/emulator.exe -list-avds
```

RUN the imulator from WSL

```
 /mnt/c/Users/Bluewind/AppData/Local/Android/Sdk/emulator/emulator.exe -avd Medium_Phone_API_36
```

## To run the app in android

Note: You can also use you phone just scan the QR code in the terminal but you need to install "EXPO GO"

```
npm run android
```

## Branching Guide to Avoid Conflicts and breaking the production app

In development we use the beta branch

Note: You should use this branch as your base branch when we are developing the application. Dont use the master

```
git checkout beta
```

## Example

If you want to create new branch for home screen

Note: Check if youre in the beta branch if not checkout to beta

```
git checkout beta
```

Update your beta branch

```
git pull
```

Create your branch for home-screen

```
git checkout -b home-screen-branch
```

ICON used
https://icons.expo.fyi/
