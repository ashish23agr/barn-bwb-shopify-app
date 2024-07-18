export default async function fetchpromotions() {
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
        return result
       
        //console.log("GetPromotionsData : ", result.data.data);
    } catch (err) {
        //console.error("Error fetching promotions:", err);
        // setpromotions([]);
    }
};