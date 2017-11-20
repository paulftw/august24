//
//  RNFirebaseUI.m
//  GoldFever
//
//  Created by Paul Korzhyk on 8/7/17.
//

#import <Foundation/Foundation.h>
#import "RNFirebaseUI.h"
#import <React/RCTLog.h>
#import <Firebase.h>

@implementation RNFirebaseUI
RCT_EXPORT_MODULE();

static FUIAuth* authUI = nil;
static UINavigationController* authViewController = nil;

static RCTPromiseResolveBlock loginResolve = nil;
static RCTPromiseRejectBlock loginReject = nil;

static NSArray<id<FUIAuthProvider>> *authProviders = nil;

RCT_EXPORT_METHOD(showLogin:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  loginReject = reject;
  loginResolve = resolve;

  if (authUI == nil) {
    authUI = [FUIAuth defaultAuthUI];
    authUI.delegate = self;
    authUI.signInWithEmailHidden = true;

    if (authProviders == nil) {
      authProviders = @[
        // [[FUIFacebookAuth alloc] init],
        [[FUIPhoneAuth alloc] initWithAuthUI:[FUIAuth defaultAuthUI]],
      ];
    }

    authUI.providers = authProviders;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    authViewController = [authUI authViewController];
    authViewController.delegate = authUI;
    UIViewController* rootCtrl = [UIApplication sharedApplication].delegate.window.rootViewController;
    [rootCtrl presentViewController:authViewController animated:YES completion:nil];
  });
}

- (void)authUI:(FUIAuth *)authUI didSignInWithUser:(nullable FIRUser *)user error:(nullable NSError *)error {
  if (user == nil) {
    [RNFirebaseUI promiseRejectAuthException:loginReject error:error];
  } else {
    NSDictionary *userDict = [RNFirebaseUI firebaseUserToDict:user];
    loginResolve(userDict);
  }
  authViewController = nil;
  loginResolve = nil;
  loginReject =  nil;
}

+ (NSDictionary *) firebaseUserToDict:(FIRUser *) user {
    NSMutableDictionary *userDict = [
            @{ @"uid": user.uid,
                    @"email": user.email ? user.email : [NSNull null],
                    @"emailVerified": @(user.emailVerified),
                    @"isAnonymous": @(user.anonymous),
                    @"displayName": user.displayName ? user.displayName : [NSNull null],
                    @"refreshToken": user.refreshToken,
                    @"providerId": [user.providerID lowercaseString],
                    @"providerData": [self convertProviderData: user.providerData]
            } mutableCopy
    ];

    if ([user valueForKey:@"photoURL"] != nil) {
        [userDict setValue: [user.photoURL absoluteString] forKey:@"photoURL"];
    }

    return userDict;
}

+ (NSArray <NSObject *> *) convertProviderData:(NSArray <id<FIRUserInfo>> *) providerData {
    NSMutableArray *output = [NSMutableArray array];

    for (id<FIRUserInfo> userInfo in providerData) {
        NSMutableDictionary *pData = [NSMutableDictionary dictionary];

        if (userInfo.providerID != nil) {
            [pData setValue: userInfo.providerID forKey:@"providerId"];
        }

        if (userInfo.uid != nil) {
            [pData setValue: userInfo.uid forKey:@"uid"];
        }

        if (userInfo.displayName != nil) {
            [pData setValue: userInfo.displayName forKey:@"displayName"];
        }

        if (userInfo.photoURL != nil) {
            [pData setValue: [userInfo.photoURL absoluteString] forKey:@"photoURL"];
        }

        if (userInfo.email != nil) {
            [pData setValue: userInfo.email forKey:@"email"];
        }

        if (userInfo.phoneNumber != nil) {
            [pData setValue: userInfo.phoneNumber forKey:@"phone"];
        }

        [output addObject:pData];
    }

    return output;
}

NSDictionary *fuiErrorStrings = nil;

+ (void) promiseRejectAuthException:(RCTPromiseRejectBlock) reject error:(NSError *)error {
    if (fuiErrorStrings == nil) {
        fuiErrorStrings = @{
            @(FUIAuthErrorCodeUserCancelledSignIn) : @"FUIAuthErrorCodeUserCancelledSignIn",
            @(FUIAuthErrorCodeProviderError) : @"FUIAuthErrorCodeProviderError",
            @(FUIAuthErrorCodeCantFindProvider) : @"FUIAuthErrorCodeCantFindProvider",
        };
    }

    NSString *message = [fuiErrorStrings objectForKey:@(error.code)];
    if (!message) {
      if (error) {
        message = [NSString stringWithFormat:@"FUI-Unknown Error [.code=%ld]", (long) error.code];
      } else {
        message = @"FUI-Unknown Error [error is null]";
      }
    }
    reject(message, message, [NSError
        errorWithDomain:FUIAuthErrorDomain
        code:error.code
        userInfo:@{
            @"code": @(error.code),
            @"message": message,
            @"error": error
        }]);
}

@end
