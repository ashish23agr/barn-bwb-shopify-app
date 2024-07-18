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
  Divider,
  Heading,
  useApi,
  BlockSpacer,
  Form,
  Grid,
  TextField,
  View,
  Style,
  Modal,
  TextBlock,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  //const { query, i18n } = useApi();
  const userData = useApi();
  const { ui } = useApi();
  const { shop } = useApi();
  const [promotions, setpromotions] = useState([]);
  const [shops, setshops] = useState([]);
  const [selectedpromotions, setSelectedpromotions] = useState([]);

  // const titleStyle = {
  //   fontSize: "56px",
  //   fontWeight: "bold",
  //   backgroundColor: "#000",
  //   marginBottom: "4px",
  //   textAlign: "center",
  // };
  const useremail = userData.buyerIdentity.email.current;

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
              "Bearer $2y$10$zvCOcxG1tAUqfqdpKSkML.V0rp5NcQegvICLdnLzEZeqPuw5pOCPa", // Replace with your actual token
          },
        }
      );

      const result = await response.json();
      console.log("GetPromotionsData : ", result.data.data);
      setpromotions(result.data.data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setpromotions([]);
    }
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
      console.log("GetShopData : ", result.data);
      setshops(result.data);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setshops([]);
    }
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

  const handleAddToPromo = async () => {
    console.log("handleAddToPromo", selectedpromotions);

    let data = JSON.stringify({
      promotions: selectedpromotions,
    });
    console.log(data);
  };

  const handleAddToList = async () => {
    console.log("selectedpromotions", selectedpromotions);

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
      <Grid columns={["10%", "fill", "10%"]} spacing="loose">
        <View border="none" padding="base">
          <Link
            appearance="monochrome"
            inlineAlignment="left"
            size="large"
            overlay={
              <Modal id="my-modal" padding title={shops.brand_name}>
                <InlineLayout
                  spacing="loose"
                  columns={["30%", "50%"]}
                  blockAlignment="left"
                >
                  <BlockStack inlineAlignment="left">
                    <Image
                      border="base"
                      borderWidth="none"
                      borderRadius="loose"
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
                      onPress={() => ui.overlay.close("my-modal")}
                    >
                      CLOSE
                    </Button>
                  </BlockStack>
                </InlineLayout>
              </Modal>
            }
          >
            ?
          </Link>
        </View>
        <View border="none" padding="base">
          <Heading level={1} inlineAlignment="center" text-emphasis-color="red">
            {shops.brand_name}
          </Heading>
        </View>
        <View border="none" padding="base"></View>
      </Grid>

      <Heading level={2} inlineAlignment="center">
        {shops.title}
      </Heading>
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
              <View border="base" padding="none" key={promotion.id}>
                <View padding="base">
                  <Text size="large" appearance="monochrome" emphasis="strong">
                    {promotion.title}
                  </Text>
                </View>
                <View padding="base">
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
                              borderRadius="loose"
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
                            <TextBlock size="medium">{promotion.description}</TextBlock>
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
                <View padding="base" border="none">
                  <Image
                    border="none"
                    borderWidth="none"
                    borderRadius="loose"
                    source={
                      "https://crosspromotion.24livehost.com/public/backend/promo/" +
                      promotion.image
                    }
                    fit="cover"
                    viewportSize="large"
                    resolution="1"
                    description={promotion.title}
                    sizes="(min-width: 100em) 50vw, 50vw"
                    aspectRatio="1"
                  />
                </View>
                <BlockStack padding="base">
                  <Button appearance={selectedpromotions?.some(
                      (p) => p.id === promotion.id
                    )?"":"critical"} onPress={() => handleCheckboxChange(promotion.id)}>
                    {selectedpromotions?.some(
                      (p) => p.id === promotion.id
                    )?"SELECTED":"YES PLEASE!"}
                  </Button>
                </BlockStack>
              </View>
            ))}
          </Grid>
        </BlockStack>

        <BlockSpacer spacing="base" />
        <View padding="base" border="none" sise="extraSmall">
          <Checkbox id="checkbox1" name="checkboxchoices">
            By sending me these offers I am also happy to sign me up to 
            {shops.brand_name} & agree for you to share my data with our partners.
          </Checkbox>
        </View>
        <BlockSpacer spacing="base" />

        <Grid columns={["70%", "fill"]} spacing="base">
          <View>
            <TextField label="Email" value={useremail} />
          </View>
          <Button
            accessibilityRole="submit"
            onPress={handleAddToList}
            disabled={selectedpromotions.length === 0}
          >
            SEND OFFERS
          </Button>
        </Grid>
      </Form>
    </BlockStack>
  );
}