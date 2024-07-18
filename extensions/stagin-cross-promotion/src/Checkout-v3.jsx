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
  const [promotions, setpromotions] = useState([]);
  const [selectedpromotions, setSelectedpromotions] = useState([]);

  const titleStyle = {
    fontSize: "56px",
    fontWeight: "bold",
    backgroundColor: "#000",
    marginBottom: "4px",
    textAlign: "center",
  };
  const useremail = userData.buyerIdentity.email.current;
  console.log(userData);
  console.log(userData.buyerIdentity.email.current);

  useEffect(() => {
    fetchpromotions();
  }, []);

  const fetchpromotions = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

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
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>
        Grab these offers from other great female owned brands.
      </Heading>
      <Form onSubmit={() => console.log("onSubmit event")}>
        <BlockStack spacing="loose">
          <Grid
            columns={Style.default(["20%", "fill", 0, 0, 0, 0]).when(
              { viewportInlineSize: { min: "small" } },
              ["15%", "fill", "15%", "fill"]
            )}
            rows={["auto", "auto"]}
            overflow="hidden"
            border="base"
            blockAlignment="center"
            maxBlockSize={90}
          >
            <View padding="base">
              <Image source="https://cdn.shopify.com/s/files/1/0760/4994/0756/files/Checkout_icons-02.png" />
            </View>
            <View padding="base">
              <Text size="extraSmall">Message 1.</Text>
            </View>
            <View padding="base">
              <Image source="https://cdn.shopify.com/s/files/1/0760/4994/0756/files/Checkout_icons-01.png" />
            </View>
            <View padding="base">
              <Text size="extraSmall">Message 2.</Text>
            </View>
            <View padding="base">
              <Image source="https://cdn.shopify.com/s/files/1/0760/4994/0756/files/Checkout_icons-03.png" />
            </View>
            <View padding="base">
              <Text size="extraSmall">Message 3.</Text>
            </View>
            <View padding="base">
              <Image source="https://cdn.shopify.com/s/files/1/0760/4994/0756/files/Checkout_icons-03.png" />
            </View>
            <View padding="base">
              <Text size="extraSmall">Message 4.</Text>
            </View>
          </Grid>

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
                  <Text
                    size="extraSmall"
                    size="extraLarge"
                    appearance="monochrome"
                    emphasis="strong"
                  >
                    {" "}
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
                            <TextBlock>{promotion.description}</TextBlock>
                            <Button
                              kind="plain"
                              onPress={() => ui.overlay.close("my-modal")}
                            >
                              Close
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
                  <Button appearance="critical" onPress={handleAddToPromo}>
                    Yes Please
                  </Button>
                  <Checkbox
                    id={promotion.id}
                    name="checkbox"
                    checked={selectedpromotions.some(
                      (p) => p.id === promotion.id
                    )}
                    onChange={() => handleCheckboxChange(promotion.id)}
                  ></Checkbox>
                </BlockStack>
              </View>
            ))}
          </Grid>
        </BlockStack>

        <BlockSpacer spacing="base" />
        <View padding="base" border="none">
          <Checkbox id="checkbox1" name="checkboxchoices">
            I agree to the{" "}
            <Link to="https://www.shopify.com">terms and conditions</Link> and{" "}
            <Link to="https://www.shopify.com">privacy policy</Link> of the
            store related to pricing, payment, shipping, returns, and liability
            set forth by Ride Sports
          </Checkbox>
        </View>
        <BlockSpacer spacing="base" />

        <Grid columns={["75%", "fill"]} spacing="base">
          <View>
            <TextField label="Email" value="" />
          </View>
          <Button
            accessibilityRole="submit"
            onPress={handleAddToList}
            disabled={selectedpromotions.length === 0}
          >
            Send Offers
          </Button>
        </Grid>
      </Form>
    </BlockStack>
  );
}