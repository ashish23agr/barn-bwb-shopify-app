import React, { useEffect, useState } from "react";
import {
  reactExtension,
  BlockStack,
  InlineLayout,
  Checkbox,
  Button,
  Link,
  Image,
  Text,
  Heading,
  useApi,
  BlockSpacer,
  Form,
  Grid,
  TextField,
  View,
  Modal,
  TextBlock,
  Badge,
  Icon,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  //const { query, i18n } = useApi();
  const userData = useApi();
  const { ui } = useApi();
  const { shop } = useApi();
  const [promotions, setpromotions] = useState([]);
  const [shops, setshops] = useState([]);
  const [checkButton, setcheckButton] = useState(true);
  const [showModel, setshowModel] = useState(true);
  const [selectedpromotions, setSelectedpromotions] = useState([]);
  const [emailValue, setEmailValue] = useState(userData.buyerIdentity.email.current);


  useEffect(() => {
    fetchpromotions();
    fetchshops();
  }, []);

  const fetchpromotions = async () => {
    try {
      const response = await fetch(
        "https://crosspromotion.24livehost.com/api/get-promos",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer $2y$10$zvCOcxG1tAUqfqdpKSkML.V0rp5NcQegvICLdnLzEZeqPuw5pOCPa",
          },
        }
      );
      const result = await response.json();
      setpromotions(result.data.data);
      //console.log("GetPromotionsData : ", result.data.data);
    } catch (err) {
      //console.error("Error fetching promotions:", err);
      setpromotions([]);
    }
  };

  const handleEmailValue = (value) => {
    setEmailValue(value);
  };

  const fetchshops = async () => {
    try {
      const response = await fetch(
        "https://crosspromotion.24livehost.com/api/get-shop?shop=" +
          shop.myshopifyDomain,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer $2y$10$zvCOcxG1tAUqfqdpKSkML.V0rp5NcQegvICLdnLzEZeqPuw5pOCPa", // Replace with your actual token
          },
        }
      );
      const result = await response.json();
      //console.log("GetShopData : ", result.data);
      setshops(result.data);
    } catch (err) {
      //console.error("Error fetching shops:", err);
      setshops([]);
    }
  };

  const termCheckboxChange = () => {
    setcheckButton(!checkButton);
  };

  const handleCheckboxChange = (promotionId) => {
    console.log("promotionId", promotionId);
    const isSelected = selectedpromotions.some(
      (promotion) => promotion.id === promotionId
    );
    if (isSelected) {
      setSelectedpromotions((prevSelected) =>
        prevSelected.filter((promotion) => promotion.id !== promotionId)
      );
    } else {
      const selectedpromotion = promotions.find(
        (promotion) => promotion.id === promotionId
      );
      if (selectedpromotion) {
        setSelectedpromotions((prevSelected) => [
          ...prevSelected,
          {
            id: selectedpromotion.id,
            title: selectedpromotion.title,
          },
        ]);
      }
    }
  };

  // const handleAddToPromo = async () => {
  //   console.log("handleAddToPromo", selectedpromotions);

  //   let data = JSON.stringify({
  //     promotions: selectedpromotions,
  //   });
  //   console.log(data);
  // };

  // useEffect(() => {
  //   console.log(selectedpromotions,selectedpromotions.length, typeof selectedpromotions)
  //   if (selectedpromotions.length === 0) {
  //     setshowModel(true)
  //   }else{
  //     setshowModel(false)
  //   }
  // }, [selectedpromotions])

  const handleAddToList = async () => {
    //console.log(emailValue, 'emailValue')
    console.log(selectedpromotions.length);
    if (selectedpromotions.length === 0) {
      setshowModel(true);
    } else {
      setshowModel(false);
    }

    let data = JSON.stringify({
      promotions: selectedpromotions,
    });

    try {
      const response = await fetch(
        "https://esimmy.24livehost.com/kioskapi/test_post.php",
        {
          method: "POST",
          body: data,
          redirect: "follow",
          mode: "no-cors",
        }
      );
      if (response) {
        const data = response.json();
        data.then((result) => {
          console.log("teeeeeeeeeeeee");
          console.log(result["data"]);
        });
      }
    } catch (error) {}
  };

  return (
    <BlockStack
      spacing="loose"
      border="base"
      padding="base"
      background="subdued"
    >
      <Grid
        columns={["5%", "fill", "5%"]}
        spacing="loose"
        border="base"
        background="base"
        padding="tight"
      >
        <View border="none" padding="none">
          <Link
            appearance="monochrome"
            inlineAlignment="left"
            size="large"
            overlay={
              <Modal id="about-modal" padding title={shops.brand_name}>
                <InlineLayout
                  spacing="loose"
                  columns={["30%", "50%"]}
                  blockAlignment="left"
                >
                  <BlockStack inlineAlignment="left">
                    <Image
                      border="base"
                      borderWidth="none"
                      borderRadius="none"
                      source={shops.image_url}
                      fit="contain"
                      viewportSize="small"
                      resolution="1"
                      description={shops.title}
                    />
                  </BlockStack>
                  <BlockStack inlineAlignment="left">
                    <TextBlock>{shops.description}</TextBlock>
                    <Button
                      appearance="monochrome"
                      inlineAlignment="left"
                      kind="plain"
                      onPress={() => ui.overlay.close("about-modal")}
                    >
                      CLOSE
                    </Button>
                  </BlockStack>
                </InlineLayout>
              </Modal>
            }
          >
            <Icon source="info" />
          </Link>
        </View>
        <View border="none" padding="none">
          <Heading level={2} inlineAlignment="center" text-emphasis-color="red">
            {shops.brand_name}
          </Heading>
        </View>
        <View border="none" padding="none" inlineAlignment="right">
          {/* <Icon source="error" /> */}
        </View>
      </Grid>
      <BlockStack inlineAlignment="center">
        <View border="none" padding="none">
          <Heading level={1} inlineAlignment="center" padding="none">
            {shops.title}
          </Heading>
          {/* <Text size="extraLarge" emphasis="bold" appearance="success" inlineAlignment="center">{shops.title}</Text> */}
        </View>
      </BlockStack>
      <Form onSubmit={() => console.log("onSubmit event")}>
        <BlockStack spacing="loose">
          <Grid
            columns={["50%", "50%"]}
            rows={["auto", "auto"]}
            spacing="loose"
            overflow="hidden"
            border="none"
            maxBlockSize={1200}
          >
            {promotions.map((promotion, index) => (
              <View
                border="base"
                padding="tight"
                key={promotion.id}
                background="base"
              >
                <View padding="none">
                  <Text size="large" appearance="success" emphasis="bold">
                    {promotion.title}
                  </Text>
                  <BlockSpacer spacing="none" />
                  <Link
                    appearance="monochrome"
                    inlineAlignment="left"
                    overlay={
                      <Modal id="my-modal" padding title={promotion.title}>
                        <InlineLayout
                          spacing="loose"
                          columns={["30%", "50%"]}
                          blockAlignment="left"
                        >
                          <BlockStack inlineAlignment="left">
                            <Image
                              border="base"
                              borderWidth="none"
                              borderRadius="none"
                              source={
                                "https://crosspromotion.24livehost.com/public/backend/promo/" +
                                promotion.image
                              }
                              fit="contain"
                              viewportSize="small"
                              resolution="1"
                              description={promotion.title}
                            />
                          </BlockStack>
                          <BlockStack inlineAlignment="left">
                            <TextBlock size="medium">
                              {promotion.description}
                            </TextBlock>
                            <Button
                              kind="plain"
                              appearance="monochrome"
                              inlineAlignment="left"
                              onPress={() => ui.overlay.close("my-modal")}
                            >
                              CLOSE
                            </Button>
                          </BlockStack>
                        </InlineLayout>
                      </Modal>
                    }
                  >
                    Learn more
                  </Link>
                </View>
                <BlockSpacer spacing="tight" />
                <Badge iconPosition="end" size="base" tone="critical">
                  {promotion.badge}
                </Badge>
                <BlockSpacer spacing="tight" />
                <View padding="none" border="none">
                  <Image
                    border="none"
                    borderWidth="none"
                    borderRadius="none"
                    source={
                      "https://crosspromotion.24livehost.com/public/backend/promo/" +
                      promotion.image
                    }
                    fit="cover"
                    viewportSize="large"
                    resolution="1"
                    description={promotion.title}
                    sizes="(min-width: 100em) 50vw, 50vw"
                    aspectRatio="1/2"
                  />
                </View>
                <BlockSpacer spacing="tight" />
                <BlockStack padding="none">
                  <Button
                    appearance={
                      selectedpromotions?.some((p) => p.id === promotion.id)
                        ? ""
                        : "critical"
                    }
                    onPress={() => handleCheckboxChange(promotion.id)}
                  >
                    {selectedpromotions?.some((p) => p.id === promotion.id)
                      ? "SELECTED"
                      : "YES PLEASE!"}
                  </Button>
                </BlockStack>
              </View>
            ))}
          </Grid>
        </BlockStack>

        <BlockSpacer spacing="tight" />
        <View padding="none" border="none" size="extraSmall">
          <Checkbox
            id="checkbox1"
            name="checkboxchoices"
            onChange={() => termCheckboxChange()}
          >
            By sending me these offers I am also happy to sign me up to{" "}
            {shops.brand_name} & agree for you to share my data with our
            partners.
          </Checkbox>
        </View>
        <BlockSpacer spacing="tight" />
        <Grid columns={["70%", "fill"]} spacing="tight">
          <View>
            <TextField
              label="Email"
              value={emailValue}
              onInput={handleEmailValue}
            />
          </View>
          <Button
            accessibilityRole="submit"
            onPress={handleAddToList}
            disabled={checkButton}
            overlay={
              showModel ? (
                <Modal id="error-modal" padding title="">
                  <Grid
                    columns={["auto"]}
                    spacing="loose"
                    inlineAlignment="center"
                  >
                    <View border="none" padding="none">
                      <Text
                        emphasis="bold"
                        size="extraLarge"
                        appearance="success"
                      >
                        Oops sorry, that didn’t quite work.
                      </Text>
                      <BlockSpacer spacing="none" />
                      <Text
                        emphasis="bold"
                        size="extraLarge"
                        appearance="success"
                      >
                        Please select your offers, enter your email and then
                        click "send offers"
                      </Text>
                      <BlockSpacer spacing="base" />
                      <BlockStack padding="none" maxInlineSize="40%">
                        <Button
                          appearance="critical"
                          onPress={() => ui.overlay.close("error-modal")}
                        >
                          GO AGAIN
                        </Button>
                      </BlockStack>
                      <BlockSpacer spacing="tight" />
                    </View>
                  </Grid>
                </Modal>
              ) : (
                ""
              )
            }
          >
            SEND OFFERS
          </Button>
        </Grid>
      </Form>
    </BlockStack>
  );
}