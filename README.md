# Requirements

Install node

Install android studio to get the Android Immulator or you can use your phone

Install java version 23

## Step1 : You must navigate first to

```
C:\Users\Bluewind\AppData\Local\Android\Sdk\emulator>
```

Then list all the emulator installed

```
./emulator -list-avds
```

```
./emulator -avd Medium_Phone_API_36
```

## To run the app in android

```
npm run android
```

## Branching Guide to Avoid Conflicts and breaking the production app

In development we use the beta branch
note: You should use this branch as your base branch when we are developing the application. Dont use the master

```
git checkout beta
```

## Example

If you want to create new branch for home screen
check if you in the beta branch if not got checkout

```
git checkout beta
```

Update your beta branch

```
git pull
```

Create your branch for home-screen

```
git checkout -b home_screen_branch
```
