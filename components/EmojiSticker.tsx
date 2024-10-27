import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  stickerSize: number;
  stickerSource: any;
};

const EmojiSticker = ({ stickerSize, stickerSource }: Props) => {
  const scaleImage = useSharedValue(stickerSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubletap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scaleImage.value !== stickerSize * 2) {
        scaleImage.value = stickerSize * 2;
      } else {
        scaleImage.value = Math.round(scaleImage.value / 2);
      }
    });

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const stickerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(scaleImage.value),
      width: withSpring(scaleImage.value),
    };
  });
  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <GestureDetector gesture={doubletap}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[stickerStyle, { height: stickerSize, width: stickerSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
};

export default EmojiSticker;
