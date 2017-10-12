package com.august24;

import android.app.Activity;
import android.content.Intent;
import android.support.annotation.MainThread;
import android.support.annotation.StringRes;
import android.support.design.widget.Snackbar;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.firebase.ui.auth.ErrorCodes;
import com.firebase.ui.auth.IdpResponse;
import com.google.firebase.auth.FirebaseAuth;
import com.firebase.ui.auth.AuthUI;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Arrays;

public class RNFirebaseUIAuthPhoneModule extends ReactContextBaseJavaModule {

  private static final int RC_SIGN_IN = 123;

  public RNFirebaseUIAuthPhoneModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNFirebaseUIAuthPhoneExample";
  }

  @ReactMethod
  public void show() {
    Activity currentActivity = getCurrentActivity();
    // Do something with FirebaseUI-Auth
    FirebaseAuth auth = FirebaseAuth.getInstance();
    if (auth.getCurrentUser() != null) {
        // already signed in
    } else {
        // not signed in
        // currentActivity.startActivityForResult(
        //   // Get an instance of AuthUI based on the default app
        //   AuthUI.getInstance().createSignInIntentBuilder().build(),
        //   RC_SIGN_IN);

        currentActivity.startActivityForResult(
          AuthUI.getInstance()
              .createSignInIntentBuilder()
              .setAvailableProviders(
                Arrays.asList(
                  // new AuthUI.IdpConfig.Builder(AuthUI.EMAIL_PROVIDER).build(),
                  new AuthUI.IdpConfig.Builder(AuthUI.PHONE_VERIFICATION_PROVIDER).build()
                  // new AuthUI.IdpConfig.Builder(AuthUI.GOOGLE_PROVIDER).build(),
                  // new AuthUI.IdpConfig.Builder(AuthUI.FACEBOOK_PROVIDER).build(),
                  // new AuthUI.IdpConfig.Builder(AuthUI.TWITTER_PROVIDER).build()
                )
              )
              .build(),
          RC_SIGN_IN);
    }
  }

}
