import React from 'react';
import {
  EmitterSubscription,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { EventSubscription, Navigation, NavigationProps, Options } from 'react-native-navigation';
import TestIDs from '../testIDs';

type Event = {
  componentId?: string;
  componentName?: string;
  componentType?: string;
  passProps?: object;
  event?: string;
  commandName?: string;
  commandId?: string;
  buttonId?: string;
  text?: string;
};

let _overlayInstance: any;
export const logLifecycleEvent = (event: Event) => {
  _overlayInstance?.addEvent(event);
};

type State = {
  text: string;
  events: Event[];
};

interface OverlayProps extends NavigationProps {
  showOnTop: boolean;
}

export default class StaticLifecycleOverlay extends React.Component<OverlayProps, State> {
  events: Event[];
  static options(): Options {
    return {
      layout: {
        componentBackgroundColor: 'transparent',
      },
    };
  }

  listeners: (EmitterSubscription | EventSubscription)[] = [];

  componentDidMount() {
    // eslint-disable-next-line consistent-this
    _overlayInstance = this;
  }

  componentWillUnmount() {
    _overlayInstance = null;
    this.listeners.forEach((listener) => listener.remove());
    this.listeners = [];
    // eslint-disable-next-line no-alert
    alert('Overlay Unmounted');
  }

  addEvent(event: Event) {
    this.events.push(event);
    this.setState({
      events: this.events,
    });
  }

  clearEvents() {
    this.events = [];
    this.setState({
      events: this.events,
    });
  }

  constructor(props: OverlayProps) {
    super(props);
    this.events = [];
    this.state = {
      text: 'nothing yet',
      events: [],
    };

    this.listeners.push(
      Navigation.events().registerComponentWillAppearListener((event) => {
        this.addEvent({ ...event, event: 'componentWillAppear' });
      })
    );

    this.listeners.push(
      Navigation.events().registerComponentDidAppearListener((event) => {
        this.addEvent({ ...event, event: 'componentDidAppear' });
      })
    );
    this.listeners.push(
      Navigation.events().registerComponentDidDisappearListener((event) => {
        this.addEvent({ ...event, event: 'componentDidDisappear' });
      })
    );
    this.listeners.push(
      Navigation.events().registerCommandListener((commandName) => {
        this.addEvent({ event: 'command started', commandName });
      })
    );
    this.listeners.push(
      Navigation.events().registerCommandCompletedListener(({ commandName }) => {
        this.addEvent({ event: 'command completed', commandName });
      })
    );
    this.listeners.push(
      Navigation.events().registerNavigationButtonPressedListener(({ componentId, buttonId }) => {
        this.addEvent({ event: 'navigationButtonPressed', buttonId, componentId });
      })
    );
    this.listeners.push(
      Navigation.events().registerModalDismissedListener(({ componentId }) => {
        this.addEvent({ event: 'modalDismissed', componentId });
      })
    );
  }

  renderEvent(event: Event) {
    if (event.commandId) {
      return <Text style={styles.h2}>{`${event.commandId}`}</Text>;
    } else if (event.commandName) {
      return <Text style={styles.h2}>{`${event.event}: ${event.commandName}`}</Text>;
    } else if (event.componentName) {
      return (
        <Text
          style={styles.h2}
        >{`${event.event} | ${event.componentName} | ${event.componentType}`}</Text>
      );
    } else if (event.buttonId) {
      return <Text style={styles.h2}>{`${event.event} | ${event.buttonId}`}</Text>;
    } else if (event.text) {
      return <Text style={styles.h2}>{`${event.text}`}</Text>;
    } else {
      return <Text style={styles.h2}>{`${event.event} | ${event.componentId}`}</Text>;
    }
  }

  render() {
    const events = this.state.events.map((event, idx) => (
      <View key={`${event.componentId}${idx}`}>{this.renderEvent(event)}</View>
    ));
    return (
      <View style={[styles.root, this.props.showOnTop && { top: 50, bottom: undefined }]}>
        <Text style={styles.h1}>{`Static Lifecycle Events Overlay`}</Text>
        <View style={styles.events}>{events}</View>
        {this.renderDismissButton()}
        {this.renderClearButton()}
      </View>
    );
  }

  renderDismissButton = () => {
    return (
      <TouchableOpacity
        style={styles.dismissBtn}
        onPress={() => Navigation.dismissOverlay(this.props.componentId)}
      >
        <Text testID={TestIDs.DISMISS_BTN} style={styles.btnText}>
          X
        </Text>
      </TouchableOpacity>
    );
  };

  renderClearButton = () => {
    return (
      <TouchableOpacity style={styles.clearBtn} onPress={() => this.clearEvents()}>
        <Text testID={TestIDs.CLEAR_OVERLAY_EVENTS_BTN} style={styles.btnText}>
          Clear
        </Text>
      </TouchableOpacity>
    );
  };
}

type Style = {
  root: ViewStyle;
  dismissBtn: ViewStyle;
  clearBtn: ViewStyle;
  btnText: TextStyle;
  events: ViewStyle;
  h1: TextStyle;
  h2: TextStyle;
};

const styles = StyleSheet.create<Style>({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#c1d5e0ae',
    flexDirection: 'column',
  },
  dismissBtn: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  clearBtn: {
    position: 'absolute',
    right: 0,
    width: 35,
    height: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  btnText: {
    color: 'red',
    alignSelf: 'center',
  },
  events: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  h1: {
    fontSize: 14,
    textAlign: 'center',
    margin: 4,
  },
  h2: {
    fontSize: 10,
  },
});
