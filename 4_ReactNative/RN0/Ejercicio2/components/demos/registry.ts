import type { ComponentType } from 'react';

import ViewDemo from './ViewDemo';
import SafeAreaViewDemo from './SafeAreaViewDemo';
import ScrollViewDemo from './ScrollViewDemo';
import KeyboardAvoidingViewDemo from './KeyboardAvoidingViewDemo';
import TextDemo from './TextDemo';
import ImageDemo from './ImageDemo';
import ImageBackgroundDemo from './ImageBackgroundDemo';
import StatusBarDemo from './StatusBarDemo';
import TextInputDemo from './TextInputDemo';
import SwitchDemo from './SwitchDemo';
import ButtonDemo from './ButtonDemo';
import PressableDemo from './PressableDemo';
import TouchableOpacityDemo from './TouchableOpacityDemo';
import TouchableHighlightDemo from './TouchableHighlightDemo';
import TouchableWithoutFeedbackDemo from './TouchableWithoutFeedbackDemo';
import FlatListDemo from './FlatListDemo';
import SectionListDemo from './SectionListDemo';
import ModalDemo from './ModalDemo';
import ActivityIndicatorDemo from './ActivityIndicatorDemo';
import RefreshControlDemo from './RefreshControlDemo';

export const DEMO_REGISTRY: Record<string, ComponentType> = {
  view: ViewDemo,
  safeareaview: SafeAreaViewDemo,
  scrollview: ScrollViewDemo,
  keyboardavoidingview: KeyboardAvoidingViewDemo,
  text: TextDemo,
  image: ImageDemo,
  imagebackground: ImageBackgroundDemo,
  statusbar: StatusBarDemo,
  textinput: TextInputDemo,
  switch: SwitchDemo,
  button: ButtonDemo,
  pressable: PressableDemo,
  touchableopacity: TouchableOpacityDemo,
  touchablehighlight: TouchableHighlightDemo,
  touchablewithoutfeedback: TouchableWithoutFeedbackDemo,
  flatlist: FlatListDemo,
  sectionlist: SectionListDemo,
  modal: ModalDemo,
  activityindicator: ActivityIndicatorDemo,
  refreshcontrol: RefreshControlDemo,
};
