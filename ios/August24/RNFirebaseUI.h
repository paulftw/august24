//
//  RNFirebaseUI.h
//  GoldFever
//
//  Created by Paul Korzhyk on 8/7/17.
//

#ifndef RNFirebaseUI_h
#define RNFirebaseUI_h

@import FirebaseAuthUI;
@import FirebasePhoneAuthUI;
// @import FirebaseFacebookAuthUI;

#import <React/RCTViewManager.h>

@interface RNFirebaseUI : RCTViewManager <FUIAuthDelegate>
@end

#endif /* RNFirebaseUI_h */
