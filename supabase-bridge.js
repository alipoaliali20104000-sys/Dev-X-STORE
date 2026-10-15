/* DEV-X STORE — Supabase connection */
(function () {
  "use strict";

  const SUPABASE_URL =
    "https://ktviowcmqlkgpmzvtluq.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_mHFHAzkp4j_sO0OUDrQkgA_A3QhJEYV";

  if (!window.supabase) {
    console.error(
      "DEV-X STORE: Supabase library was not loaded."
    );
    return;
  }

  const client = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  async function loadCatalog() {
    const [
      categoriesResult,
      productsResult,
      imagesResult
    ] = await Promise.all([
      client
        .from("categories")
        .select(
          "id,name,slug,description,image_url,is_active"
        )
        .eq("is_active", true)
        .order("name"),

      client
        .from("products")
        .select(
          "id,category_id,name,slug,description,price,stock_quantity,sku,is_active,created_at,category:categories(id,name,slug)"
        )
        .eq("is_active", true)
        .order("created_at", {
          ascending: false
        }),

      client
        .from("product_images")
        .select(
          "id,product_id,image_url,alt_text,sort_order"
        )
        .order("sort_order", {
          ascending: true
        })
    ]);

    if (
      categoriesResult.error ||
      productsResult.error ||
      imagesResult.error
    ) {
      throw (
        categoriesResult.error ||
        productsResult.error ||
        imagesResult.error
      );
    }

    return {
      categories: categoriesResult.data || [],
      products: productsResult.data || [],
      images: imagesResult.data || []
    };
  }

  window.DEVX_SUPABASE = {
    client: client,
    loadCatalog: loadCatalog
  };

  console.log(
    "DEV-X STORE: Supabase client initialized."
  );
})();
