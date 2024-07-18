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
  GridItem,
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
  const [emailValue, setEmailValue] = useState(
    userData.buyerIdentity.email.current
  );
  //var myshopifyDomain =  shop.myshopifyDomain;
  var myshopifyDomain =  'store6.com';
  
  useEffect(() => {
    fetchpromotions();
    fetchshops();
  }, []);

  const fetchpromotions = async () => {
    try {
      const response = await fetch(
        "https://crosspromotion.24livehost.com/api/get-promos?shop=" +
        myshopifyDomain,
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
      setpromotions(result.data);
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
        myshopifyDomain,
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
      (promotion) => promotion.promo_id === promotionId
    );
    if (isSelected) {
      setSelectedpromotions((prevSelected) =>
        prevSelected.filter((promotion) => promotion.promo_id !== promotionId)
      );
    } else {
      const selectedpromotion = promotions.find(
        (promotion) => promotion.promo_id === promotionId
      );
      if (selectedpromotion) {
        setSelectedpromotions((prevSelected) => [
          ...prevSelected,
          {
            promo_id: selectedpromotion.promo_id,
            promo_title: selectedpromotion.promo_title,
            shop_id: selectedpromotion.shop_id,
          },
        ]);
      }
    }
  };

  // useEffect(() => {
  //   console.log(selectedpromotions,selectedpromotions.length, typeof selectedpromotions)
  //   if (selectedpromotions.length === 0) {
  //     setshowModel(true)
  //   }else{
  //     setshowModel(false)
  //   }
  // }, [selectedpromotions])

  const handleAddToList = async () => {
    console.log(
      "Length : " + selectedpromotions.length + " emailValue : " + emailValue
    );
    if (selectedpromotions.length === 0 || !emailValue) {
      console.log("showModelTrue");
      setshowModel(true);
    } else {
      console.log("showModelFalse");
      setshowModel(false);
    }

    let data = JSON.stringify({
      promotions: selectedpromotions,
      useremail: emailValue,
      //shop: shop.myshopifyDomain,
    });

    try {
      const response = await fetch(
        "https://crosspromotion.24livehost.com/api/shop/signup",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "Bearer $2y$10$zvCOcxG1tAUqfqdpKSkML.V0rp5NcQegvICLdnLzEZeqPuw5pOCPa", // Replace with your actual token
          },
          method: "POST",
          body: data,
        }
      );
      if (response) {
        const data = response.json();
        data.then((result) => {
          console.log(result["data"]);
        });
      }
    } catch (error) {}
  };

  return (
    <BlockStack
      spacing="none"
      border="base"
      padding="none"
      background="subdued"
    >
      <Grid
        columns={["fill"]}
        spacing="none"
        border="none"
        background="transparent"
        padding="none"
      >
        <View border="none" padding="none">
          <Link
            appearance="monochrome"
            inlineAlignment="left"
            size="large"
            overlay={
              <Modal id="about-modal" padding title="ABOUT BUY WOMEN BUILT">
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
                        "https://crosspromotion.24livehost.com/public/backend/shop/" +
                        shops.brand_image
                      }
                      fit="contain"
                      viewportSize="small"
                      resolution="1"
                      description="ABOUT BUY WOMEN BUILT"
                    />
                  </BlockStack>
                  <BlockStack inlineAlignment="left">
                    <TextBlock>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </TextBlock>
                  </BlockStack>
                </InlineLayout>
              </Modal>
            }
          >
            <Image
              border="base"
              borderWidth="none"
              borderRadius="none"
              source={
                "https://crosspromotion.24livehost.com/public/backend/app/header.png"
              }
              fit="contain"
              viewportSize="small"
              resolution="1"
              description="ABOUT BUY WOMEN BUILT"
            />
          </Link>
        </View>
      </Grid>
      {/* <Grid
        columns={["30%", "40%", "30%"]}
        spacing="none"
        border="none"
        background="base"
        padding="none"
      >
        <View border="none" padding="none">
        <Link
            appearance="monochrome"
            inlineAlignment="left"
            size="large"
            overlay={
              <Modal id="about-modal" padding title="ABOUT BUY WOMEN BUILT">
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
                        "https://crosspromotion.24livehost.com/public/backend/shop/" +
                        shops.brand_image
                      }
                      fit="contain"
                      viewportSize="small"
                      resolution="1"
                      description="ABOUT BUY WOMEN BUILT"
                    />
                  </BlockStack>
                  <BlockStack inlineAlignment="left">
                    <TextBlock>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </TextBlock>
                  </BlockStack>
                </InlineLayout>
              </Modal>
            }
          >
          
         

        <Image
                  border="none"
                  borderWidth="none"
                  borderRadius="none"
                  source={"https://crosspromotion.24livehost.com/public/backend/app/Rectangle-left-top.png"}
                  fit="contain"
                  viewportSize="small"
                  resolution="1"
                  description="ABOUT BUY WOMEN BUILT"
                />
          </Link>
        </View>
        <View border="none" padding="none">
        <Image
                  border="none"
                  borderWidth="none"
                  borderRadius="none"
                  source={"https://crosspromotion.24livehost.com/public/backend/app/Layer-center-top.png"}
                  fit="contain"
                  viewportSize="small"
                  resolution="1"
                  description="ABOUT BUY WOMEN BUILT"
                />
        </View>
        <View border="none" padding="none" inlineAlignment="right">
        <Image
                  border="none"
                  borderWidth="none"
                  borderRadius="none"
                  source={"https://crosspromotion.24livehost.com/public/backend/app/Rectangle-right-top.png"}
                  fit="contain"
                  viewportSize="small"
                  resolution="1"
                  description="ABOUT BUY WOMEN BUILT"
                />
        </View>
      </Grid> */}

      {/* <Grid
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
              <Modal id="about-modal" padding title="ABOUT BUY WOMEN BUILT">
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
                        "https://crosspromotion.24livehost.com/public/backend/shop/" +
                        shops.brand_image
                      }
                      fit="contain"
                      viewportSize="small"
                      resolution="1"
                      description="ABOUT BUY WOMEN BUILT"
                    />
                  </BlockStack>
                  <BlockStack inlineAlignment="left">
                    <TextBlock>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and scrambled it to make a
                      type specimen book. It has survived not only five
                      centuries, but also the leap into electronic typesetting,
                      remaining essentially unchanged. It was popularised in the
                      1960s with the release of Letraset sheets containing Lorem
                      Ipsum passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </TextBlock>
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
            BUY WOMEN BUILT
          </Heading>
        </View>
        <View border="none" padding="none" inlineAlignment="right">
          
        </View>
      </Grid> */}

      {/* <BlockStack inlineAlignment="center">
        <View border="none" padding="none">
          <Heading level={1} inlineAlignment="center" padding="none">
            GRAB THESE OFFERS FROM OTHER GREATE FEMALE OWNED BRANDS
          </Heading>
        </View>
      </BlockStack> */}

      <Form onSubmit={() => console.log("onSubmit event")}>
        <BlockStack spacing="none">
          <Grid
            columns={["50%", "50%"]}
            rows={["auto", "auto"]}
            spacing="loose"
            overflow="hidden"
            padding="tight"
            border="none"
            maxBlockSize={1200}
          >
            {promotions.map((promotion, index) => (
              <View
                border="base"
                padding="tight"
                key={promotion.promo_id}
                background="base"
              >
                <View padding="none">
                  <Text size="large" appearance="success" emphasis="bold">
                    {promotion.promo_title}
                  </Text>
                  <BlockSpacer spacing="none" />
                  <Link
                    appearance="monochrome"
                    inlineAlignment="left"
                    overlay={
                      <Modal
                        id="learnmore-modal"
                        padding
                        title={promotion.brand_title}
                      >
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
                                "https://crosspromotion.24livehost.com/public/backend/shop/" +
                                promotion.brand_image
                              }
                              fit="contain"
                              viewportSize="small"
                              resolution="1"
                              description={promotion.brand_title}
                            />
                          </BlockStack>
                          <BlockStack inlineAlignment="left">
                            <TextBlock size="medium">
                              {promotion.brand_description}
                            </TextBlock>
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
                      promotion.promo_image
                    }
                    fit="cover"
                    viewportSize="large"
                    resolution="1"
                    description={promotion.promo_title}
                    sizes="(min-width: 100em) 50vw, 50vw"
                    aspectRatio="1/2"
                  />
                </View>
                <BlockSpacer spacing="tight" />
                <BlockStack padding="none">
                  <Button
                    appearance={
                      selectedpromotions?.some(
                        (p) => p.promo_id === promotion.promo_id
                      )
                        ? ""
                        : "critical"
                    }
                    onPress={() => handleCheckboxChange(promotion.promo_id)}
                  >
                    {selectedpromotions?.some(
                      (p) => p.promo_id === promotion.promo_id
                    )
                      ? "SELECTED"
                      : "YES PLEASE!"}
                  </Button>
                </BlockStack>
              </View>
            ))}
          </Grid>
        </BlockStack>

        <Grid columns={["56%", "fill"]} spacing="tight" padding="tight">
          <GridItem columnSpan={2}>
            <Checkbox
              id="checkbox1"
              name="checkboxchoices"
              onChange={() => termCheckboxChange()}
            >
              By sending me these offers I am also happy to sign me up to Buy Women Built & agree for you to share my data with our
              partners.
            </Checkbox>
          </GridItem>

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
                      <Text size="large" appearance="success">
                        Oops sorry, that didn’t quite work.
                      </Text>
                      <BlockSpacer spacing="tight" />
                      <Text size="large" appearance="success">
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
