import Utils from './Utils';
import TestIDs from '../playground/src/testIDs';
import Android from './AndroidUtils';

const { elementByLabel, elementById, expectImagesToBeEqual } = Utils;

describe('BottomTabs', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    await elementById(TestIDs.BOTTOM_TABS_BTN).tap();
    await expect(elementByLabel('First Tab')).toBeVisible();
  });

  it.e2e('should mount first tab first', async () => {
    await expect(elementById(TestIDs.MOUNTED_SCREENS_TEXT)).toHaveText(
      'Mounted screens: FirstBottomTabScreen, SecondBottomTabScreen'
    );
  });

  it('switch to tab by index', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_INDEX_BTN).tap();
    await expect(elementByLabel('First Tab')).toBeNotVisible();
    await expect(elementByLabel('Second Tab')).toBeVisible();
  });

  it('switch to tab by componentId', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_COMPONENT_ID_BTN).tap();
    await expect(elementByLabel('First Tab')).toBeNotVisible();
    await expect(elementByLabel('Second Tab')).toBeVisible();
  });

  it('push bottom tabs', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_INDEX_BTN).tap();
    await elementById(TestIDs.PUSH_BTN).tap();
    await expect(elementById(TestIDs.PUSHED_BOTTOM_TABS)).toBeVisible();
  });

  it('set Tab Bar badge on current Tab', async () => {
    await elementById(TestIDs.SET_BADGE_BTN).tap();
    await expect(element(by.text('NEW'))).toBeVisible();
  });

  it('Badge not cleared after showing/dismissing modal', async () => {
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.SET_BADGE_BTN).tap();
    await expect(element(by.text('Badge'))).toBeVisible();
    await elementById(TestIDs.MODAL_BTN).tap();
    await elementById(TestIDs.MODAL_BTN).tap();
    await elementById(TestIDs.DISMISS_MODAL_BTN).tap();
    await expect(element(by.text('Badge'))).toBeVisible();
  });

  it('set empty string badge on a current Tab should clear badge', async () => {
    await elementById(TestIDs.SET_BADGE_BTN).tap();
    await expect(element(by.text('NEW'))).toBeVisible();
    await elementById(TestIDs.CLEAR_BADGE_BTN).tap();
    await expect(element(by.text('NEW'))).toBeNotVisible();
  });

  it.e2e('merge options correctly in SideMenu inside BottomTabs layout', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_INDEX_BTN).tap();
    await elementById(TestIDs.SIDE_MENU_INSIDE_BOTTOM_TABS_BTN).tap();
    await elementById(TestIDs.OPEN_LEFT_SIDE_MENU_BTN).tap();

    await elementById(TestIDs.CLOSE_LEFT_SIDE_MENU_BTN).tap();
    await expect(elementById(TestIDs.CLOSE_LEFT_SIDE_MENU_BTN)).toBeNotVisible();
  });

  it(':android: hide Tab Bar', async () => {
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
    await elementById(TestIDs.HIDE_TABS_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
  });

  it(':android: show Tab Bar', async () => {
    await elementById(TestIDs.HIDE_TABS_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.SHOW_TABS_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
  });

  it.e2e(':android: should set special stylizing options in root bottom-tabs', async () => {
    await elementById(TestIDs.SCREEN_ROOT_LIST).scrollTo('bottom');
    await elementById(TestIDs.SET_ROOT_BTN).tap();
    const snapshotImagePath = `./e2e/assets/bottom_tabs.stylized-root.png`;
    const actual =
      await elementById('RNN.BottomTabsLayoutRoot').takeScreenshot(`bottom_tabs_stylized-root`);
    expectImagesToBeEqual(actual, snapshotImagePath);
  });

  it.e2e(':android: should merge special stylizing options', async () => {
    await elementById(TestIDs.SCREEN_ROOT_LIST).scrollTo('bottom');
    await elementById(TestIDs.STYLIZE_TABS_BTN).tap();
    const snapshotImagePath = `./e2e/assets/bottom_tabs.stylized.png`;
    const actual =
      await elementById('RNN.BottomTabsLayoutRoot').takeScreenshot(`bottom_tabs_stylized`);
    expectImagesToBeEqual(actual, snapshotImagePath);
  });

  it('hide Tab Bar on push', async () => {
    await elementById(TestIDs.HIDE_TABS_PUSH_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.POP_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
  });

  it('hide Tab Bar on push from second bottomTabs screen', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_INDEX_BTN).tap();
    await elementById(TestIDs.HIDE_TABS_PUSH_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.POP_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
  });

  it('hide Tab Bar on push from second bottomTabs screen - deep stack', async () => {
    await elementById(TestIDs.SWITCH_TAB_BY_INDEX_BTN).tap();
    await elementById(TestIDs.HIDE_TABS_PUSH_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.PUSH_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
    await elementById(TestIDs.POP_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.POP_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
  });

  it('hide Tab Bar on second tab after pressing the tab', async () => {
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.HIDE_TABS_PUSH_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeNotVisible();
    await elementById(TestIDs.POP_BTN).tap();
    await expect(elementById(TestIDs.BOTTOM_TABS)).toBeVisible();
  });

  it('invoke bottomTabPressed event', async () => {
    await elementById(TestIDs.THIRD_TAB_BAR_BTN).tap();
    await expect(elementByLabel('BottomTabPressed')).toBeVisible();
    await elementByLabel('OK').tap();
    await expect(elementByLabel('First Tab')).toBeVisible();
  });

  it.e2e(':android: hardware back tab selection history', async () => {
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.FIRST_TAB_BAR_BUTTON).tap();
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.FIRST_TAB_BAR_BUTTON).tap();

    await Android.pressBack();
    await expect(elementByLabel('Second Tab')).toBeVisible();

    await Android.pressBack();
    await expect(elementByLabel('First Tab')).toBeVisible();

    await Android.pressBack();
    await expect(elementByLabel('Second Tab')).toBeVisible();

    await Android.pressBack();
    await expect(elementByLabel('First Tab')).toBeVisible();

    await Android.pressBack();
    await expect(elementByLabel('First Tab')).toBeNotVisible();
    await expect(elementByLabel('Second Tab')).toBeNotVisible();
  });

  it.e2e('Switch tab should send lifecycle events', async () => {
    await elementById(TestIDs.SECOND_TAB_BAR_BTN).tap();
    await elementById(TestIDs.STATIC_EVENTS_OVERLAY_BTN).tap();
    await elementById(TestIDs.CLEAR_OVERLAY_EVENTS_BTN).tap();
    await elementById(TestIDs.FIRST_TAB_BAR_BUTTON).tap();
    await expect(
      elementByLabel('componentWillAppear | FirstBottomTabsScreen | Component')
    ).toBeVisible();
    await expect(
      elementByLabel('componentDidDisappear | SecondBottomTabsScreen | Component')
    ).toBeVisible();
    await expect(
      elementByLabel('componentDidAppear | FirstBottomTabsScreen | Component')
    ).toBeVisible();
  });
});
