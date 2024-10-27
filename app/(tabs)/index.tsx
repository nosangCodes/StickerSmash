import React from "react";

import { Platform, StyleSheet, View } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";

import PlaceholderImage from "@/assets/images/background-image.png";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/CircleButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";
import domToImage from "dom-to-image";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<string | null>(null);

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View | null>(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [320, 440],
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowOptions(true);
    } else {
      alert("You did not select any image");
    }
  };

  const onReset = () => {
    setShowOptions(false);
    setPickedEmoji(null);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS === "web" && imageRef.current) {
      try {
        const dataUrl = await domToImage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });
        let link = document.createElement("a");
        link.download = "sticker-smah.jpg";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error(error);
      }
    }
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Image saved");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.imageContainer}>
          <View collapsable={false} ref={imageRef}>
            <ImageViewer
              selectedImage={selectedImage}
              imgSource={PlaceholderImage}
            />
            {pickedEmoji && (
              <EmojiSticker stickerSource={pickedEmoji} stickerSize={40} />
            )}
          </View>
        </View>
        {showOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton
                icon="save-alt"
                label="save"
                onPress={onSaveImageAsync}
              />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button
              onPress={pickImageAsync}
              theme="primary"
              label="Choose a photo"
            />
            <Button
              onPress={() => setShowOptions(true)}
              label="Use this photo"
            />
          </View>
        )}
        <EmojiPicker onClose={onModalClose} isVisible={isModalVisible}>
          <EmojiList onCloseModal={onModalClose} onSelect={setPickedEmoji} />
        </EmojiPicker>
      </GestureHandlerRootView>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
    paddingTop: 40,
  },
  text: {
    color: "#fff",
    fontSize: 30,
  },
  link: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: "auto",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
    marginHorizontal: "auto",
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
