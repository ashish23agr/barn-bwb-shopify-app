import React, { useEffect, useState } from "react";
import {
  reactExtension,
  BlockStack,
  InlineLayout,
  Checkbox,
  Button,
  Image,
  Text,
  Divider,
  Heading,
  useApi,
} from "@shopify/ui-extensions-react/checkout";
import axios from 'axios';

export default reactExtension("purchase.thank-you.block.render", () => <App />);

function App() {
  const { query, i18n } = useApi();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      const {data} = await axios.get("https://crosspromotion.24livehost.com/api/get-promos");
      console.log("data", data);
      setProducts(data.data.products.edges); 

    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }            
  };

  const handleCheckboxChange = (productId) => {

    console.log("productId", productId);
    const isSelected = selectedProducts.some(product => product.id === productId);
    if (isSelected) {
      setSelectedProducts(prevSelected => prevSelected.filter(product => product.id !== productId));
    } else {
      const selectedProduct = products.find(product => product.node.id === productId);
      if (selectedProduct) {
        setSelectedProducts(prevSelected => [...prevSelected, {
          id: selectedProduct.node.id,
          title: selectedProduct.node.title,
          price: selectedProduct.node.variants.edges[0].node.price
        }]);
      }
    }
  };

  const handleAddToList = async () => {
      console.log("selectedProducts", selectedProducts);
    
      let data = JSON.stringify({
        products: selectedProducts,
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
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing='loose'>
        {
          products.map((product, index) => (
            <InlineLayout 
              key={product.node.id}
              spacing='base'
              columns={['5%', '10%', 'fill', 'auto']}
              blockAlignment='center'>
              <Checkbox 
                id={product.node.id} 
                name="checkbox" 
                checked={selectedProducts.some(p => p.id === product.node.id)}
                onChange={() => handleCheckboxChange(product.node.id)}>
              </Checkbox>
              <Image
                border='base'
                borderWidth='base'
                borderRadius='loose' 
                source={product.node.images.edges[0].node.src}
                description={product.node.title} />
              <BlockStack inlineAlignment="left">
                <Text size='medium' emphasis='strong'>{product.node.title}</Text>  
                <Text appearance='subdued'>{product.node.variants.edges[0].node.price}</Text>               
              </BlockStack>
              <Button 
                onPress={handleAddToList}
                disabled={selectedProducts.length === 0} // Disable button if no products are selected
              > 
                Add to list
              </Button>
            </InlineLayout>
          ))
        }
      </BlockStack>
    </BlockStack>
  );
}
