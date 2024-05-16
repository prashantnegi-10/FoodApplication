namespace FoodApplication.Models
{
    public class OrderRecipeDetails
    {
        public string? Id { get; set; }

        public string? Cooking_time { get; set; }
        public string? Image_url { get; set; }
        public string? Publisher { get; set; }
        public string? Title { get; set; }
        public List<Ingredients> Ingredients { get; set; }  
        public OrderRecipeDetails()
        {
            Ingredients = new List<Ingredients>();
        }
    }
    public class Ingredients
    {
        public string? Description { get; set; }
        public int? Quantity { get; set; }
        public string? unit { get; set; }
    }

}
