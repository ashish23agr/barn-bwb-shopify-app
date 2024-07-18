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
  const {ui} = useApi();
  const [promotions, setpromotions] = useState([]);
  const [selectedpromotions, setSelectedpromotions] = useState([]);

  console.log(userData); 
  console.log(userData.buyerIdentity.email.current);

  useEffect(() => {
    fetchpromotions();
  }, []);

  const fetchpromotions = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const response = await fetch('https://crosspromotion.24livehost.com/api/get-promos', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $2y$10$zvCOcxG1tAUqfqdpKSkML.V0rp5NcQegvICLdnLzEZeqPuw5pOCPa' // Replace with your actual token
        }
      }); 

      const result = await response.json();
      console.log("GetPromotionsData : ", result.data.data);
      setpromotions(result.data.data); 

    } catch (err) {
      console.error('Error fetching promotions:', err);
      setpromotions([]);
    }             
  };

  const handleCheckboxChange = (promotionId) => {

    console.log("promotionId", promotionId);
    const isSelected = selectedpromotions.some(promotion => promotion.id === promotionId);
    if (isSelected) {
      setSelectedpromotions(prevSelected => prevSelected.filter(promotion => promotion.id !== promotionId));
    } else {
      const selectedpromotion = promotions.find(promotion => promotion.id === promotionId);
      if (selectedpromotion) {
        setSelectedpromotions(prevSelected => [...prevSelected, {
          id: selectedpromotion.id,
          title: selectedpromotion.title
        }]);
      }
    }
  };

  const handleAddToList = async () => {
      console.log("selectedpromotions", selectedpromotions);
    
      let data = JSON.stringify({
        promotions: selectedpromotions,
      });
    
      try {
        const response = await fetch('https://esimmy.24livehost.com/kioskapi/test_post.php', {
          method: 'POST',
          body: data,
          redirect:"follow",
          mode : "no-cors"
        })
        if (response) {
          const data = response.json()
          data.then(result => {
            console.log("teeeeeeeeeeeee");
            console.log(result['data']);
          });
        }
      } 
      catch (error) {
        
      }

  }; 


  return (
    
    <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>Grab these offers from other great female owned brands.</Heading>
    
      <BlockStack spacing='loose'>
        {
          promotions.map((promotion, index) => (
            <InlineLayout 
              key={promotion.id}
              spacing='loose'
              columns={['30%','50%']}
              blockAlignment='left'>
              <BlockStack inlineAlignment="left">
                <Image
                  border='base'
                  borderWidth='none'
                  borderRadius='loose' 
                  source={'https://crosspromotion.24livehost.com/public/backend/promo/'+promotion.image}
                  fit='contain'
                  viewportSize='small'
                  resolution='1'
                  description={promotion.title} />
              </BlockStack>

              <BlockStack>
                
                <Text className="custom-text" size='medium' emphasis='strong'>{promotion.title}</Text>  
              
                <Link
                  overlay={
                    <Modal
                      id="my-modal"
                      padding
                      title={promotion.title}
                    >
                    <InlineLayout 
                        spacing='loose'
                        columns={['30%','50%']}
                        blockAlignment='left'>
                          <BlockStack inlineAlignment="left">
                      <Image
                  border='base'
                  borderWidth='none'
                  borderRadius='loose' 
                  source={'https://crosspromotion.24livehost.com/public/backend/promo/'+promotion.image}
                  fit='contain'
                  viewportSize='small'
                  resolution='1'
                  description={promotion.title} />
                  </BlockStack>
                  <BlockStack inlineAlignment="left">
                      <TextBlock>
                      {promotion.description}
                      </TextBlock>
                      <Button kind='plain'
                        onPress={() =>
                          ui.overlay.close('my-modal')
                        }
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

                <Checkbox 
                  id={promotion.id} 
                  name="checkbox" 
                  checked={selectedpromotions.some(p => p.id === promotion.id)}
                  onChange={() => handleCheckboxChange(promotion.id)}>
                </Checkbox> 
                <Button appearance="critical"> 
                  Yes Please
                </Button>
                      
              </BlockStack>

            
            </InlineLayout>
          ))
        }
      </BlockStack>

      <Form
      onSubmit={() =>
        console.log('onSubmit event')
      }
    >
      <Grid
        columns={['75%', 'fill']}
        spacing="base"
      >
        <View>
          <TextField label="Email" value=""/>
        </View>
        <Button accessibilityRole="submit" onPress={handleAddToList}
                  disabled={selectedpromotions.length === 0}>
        Send Offers
      </Button>
      </Grid>
    </Form>

    </BlockStack>
  );
}
