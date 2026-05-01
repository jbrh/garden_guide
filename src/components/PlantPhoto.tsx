import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from "react-native";
import type { ImageSourcePropType } from "react-native";

import { colors } from "@/constants/ui";

interface PlantPhotoProps {
  source?: ImageSourcePropType | null;
  uri: string | null | undefined;
  size?: number;
}

export function PlantPhoto({ source, uri, size = 96 }: PlantPhotoProps) {
  const resolvedSource = source ?? (uri ? { uri } : null);
  const [isLoaded, setIsLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  if (!resolvedSource) {
    return null;
  }

  useEffect(() => {
    setIsLoaded(false);
    opacity.setValue(0);
    rotation.setValue(0);
  }, [opacity, resolvedSource, rotation]);

  useEffect(() => {
    if (isLoaded) {
      rotation.stopAnimation();
      return;
    }

    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [isLoaded, rotation]);

  function handleLoadEnd() {
    setIsLoaded(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.frame, { width: size, height: size }]}>
      {!isLoaded ? (
        <View style={styles.placeholder}>
          <Animated.View
            style={[
              styles.dotLoader,
              {
                transform: [{ rotate }],
              },
            ]}
          >
            <View style={[styles.dot, styles.dotTop]} />
            <View style={[styles.dot, styles.dotLeft]} />
            <View style={[styles.dot, styles.dotRight]} />
          </Animated.View>
        </View>
      ) : null}
      <Animated.Image
        onLoadEnd={handleLoadEnd}
        resizeMode="cover"
        source={resolvedSource}
        style={[
          styles.image,
          { width: size, height: size, opacity },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    overflow: "hidden",
  },
  image: {
    borderRadius: 18,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
  },
  dotLoader: {
    height: 24,
    position: "relative",
    width: 24,
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 6,
    opacity: 0.72,
    position: "absolute",
    width: 6,
  },
  dotTop: {
    left: 9,
    top: 1.5,
  },
  dotLeft: {
    left: 2.5,
    top: 13,
  },
  dotRight: {
    left: 15.5,
    top: 13,
  },
});
