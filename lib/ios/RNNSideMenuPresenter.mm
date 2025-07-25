#import "RNNSideMenuPresenter.h"
#import "RNNSideMenuSideOptions.h"
#import "RNNSideMenuViewController.h"

@implementation RNNSideMenuPresenter

- (instancetype)initWithDefaultOptions:(RNNNavigationOptions *)defaultOptions {
    self = [super initWithDefaultOptions:defaultOptions];
    return self;
}

- (void)applyOptions:(RNNNavigationOptions *)options {
    [super applyOptions:options];
    RNNNavigationOptions *withDefault = [options withDefault:[self defaultOptions]];

    [self.sideMenuController side:MMDrawerSideLeft
                          enabled:[withDefault.sideMenu.left.enabled withDefault:YES]];
    [self.sideMenuController side:MMDrawerSideRight
                          enabled:[withDefault.sideMenu.right.enabled withDefault:YES]];

    [self.sideMenuController
        setShouldStretchLeftDrawer:[withDefault.sideMenu.left.shouldStretchDrawer withDefault:YES]];
    [self.sideMenuController
        setShouldStretchRightDrawer:[withDefault.sideMenu.right.shouldStretchDrawer
                                        withDefault:YES]];

    [self.sideMenuController
        setAnimationVelocityLeft:[withDefault.sideMenu.left.animationVelocity withDefault:840.0f]];
    [self.sideMenuController setAnimationVelocityRight:[withDefault.sideMenu.right.animationVelocity
                                                           withDefault:840.0f]];

    [self.sideMenuController setAnimationType:[withDefault.sideMenu.animationType withDefault:nil]];

    if (withDefault.sideMenu.left.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft width:withDefault.sideMenu.left.width.get];
    }

    if (withDefault.sideMenu.right.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight width:withDefault.sideMenu.right.width.get];
    }

    if (withDefault.sideMenu.left.visible.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft
                              visible:withDefault.sideMenu.left.visible.get];
        [withDefault.sideMenu.left.visible consume];
    }

    if (withDefault.sideMenu.right.visible.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight
                              visible:withDefault.sideMenu.right.visible.get];
        [withDefault.sideMenu.right.visible consume];
    }

    [self.sideMenuController.view
        setBackgroundColor:[withDefault.layout.backgroundColor withDefault:nil]];

    MMDrawerOpenMode openModeLeft = MMDrawerOpenModeAboveContent; // Default value
    if (withDefault.sideMenu.left.openMode.hasValue) {
        NSString *openModeString = withDefault.sideMenu.left.openMode.get;
        openModeLeft = MMDrawerOpenModeFromString(openModeString);
    }
    [self.sideMenuController side:MMDrawerSideLeft openMode:openModeLeft];

    MMDrawerOpenMode openModeRight = MMDrawerOpenModeAboveContent; // Default value
    if (withDefault.sideMenu.right.openMode.hasValue) {
        NSString *openModeString = withDefault.sideMenu.right.openMode.get;
        openModeRight = MMDrawerOpenModeFromString(openModeString);
    }
    [self.sideMenuController side:MMDrawerSideRight openMode:openModeRight];
}

- (void)applyOptionsOnInit:(RNNNavigationOptions *)initialOptions {
    [super applyOptionsOnInit:initialOptions];

    RNNNavigationOptions *withDefault = [initialOptions withDefault:[self defaultOptions]];
    if (withDefault.sideMenu.left.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft width:withDefault.sideMenu.left.width.get];
    }

    if (withDefault.sideMenu.right.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight width:withDefault.sideMenu.right.width.get];
    }

    [self.sideMenuController
        setOpenDrawerGestureModeMask:
            [[withDefault.sideMenu.openGestureMode
                withDefault:@(MMOpenDrawerGestureModeBezelPanningCenterView)] integerValue]];
}

- (void)mergeOptions:(RNNNavigationOptions *)options
     resolvedOptions:(RNNNavigationOptions *)currentOptions {
    [super mergeOptions:options resolvedOptions:currentOptions];

    if (options.sideMenu.left.enabled.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft enabled:options.sideMenu.left.enabled.get];
    }

    if (options.sideMenu.right.enabled.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight enabled:options.sideMenu.right.enabled.get];
    }

    if (options.sideMenu.left.visible.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft visible:options.sideMenu.left.visible.get];
        [options.sideMenu.left.visible consume];
    }

    if (options.sideMenu.right.visible.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight visible:options.sideMenu.right.visible.get];
        [options.sideMenu.right.visible consume];
    }

    if (options.sideMenu.left.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideLeft width:options.sideMenu.left.width.get];
    }

    if (options.sideMenu.right.width.hasValue) {
        [self.sideMenuController side:MMDrawerSideRight width:options.sideMenu.right.width.get];
    }

    if (options.sideMenu.left.shouldStretchDrawer.hasValue) {
        self.sideMenuController.shouldStretchLeftDrawer =
            options.sideMenu.left.shouldStretchDrawer.get;
    }

    if (options.sideMenu.right.shouldStretchDrawer.hasValue) {
        self.sideMenuController.shouldStretchRightDrawer =
            options.sideMenu.right.shouldStretchDrawer.get;
    }

    if (options.sideMenu.left.openMode.hasValue) {
        NSString *openModeString = options.sideMenu.left.openMode.get;
        MMDrawerOpenMode openMode = MMDrawerOpenModeFromString(openModeString);
        [self.sideMenuController side:MMDrawerSideLeft openMode:openMode];
    }

    if (options.sideMenu.right.openMode.hasValue) {
        NSString *openModeString = options.sideMenu.right.openMode.get;
        MMDrawerOpenMode openMode = MMDrawerOpenModeFromString(openModeString);
        [self.sideMenuController side:MMDrawerSideRight openMode:openMode];
    }

    if (options.sideMenu.left.animationVelocity.hasValue) {
        self.sideMenuController.animationVelocityLeft = options.sideMenu.left.animationVelocity.get;
    }

    if (options.sideMenu.right.animationVelocity.hasValue) {
        self.sideMenuController.animationVelocityRight =
            options.sideMenu.right.animationVelocity.get;
    }

    if (options.sideMenu.animationType.hasValue) {
        [self.sideMenuController setAnimationType:options.sideMenu.animationType.get];
    }

    if (options.layout.backgroundColor.hasValue) {
        [self.sideMenuController.view setBackgroundColor:options.layout.backgroundColor.get];
    }
}

- (RNNSideMenuViewController *)sideMenuController {
    return (RNNSideMenuViewController *)self.boundViewController;
}

@end
