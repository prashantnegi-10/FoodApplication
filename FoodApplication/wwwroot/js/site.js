// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


let apiURL = "https://forkify-api.herokuapp.com/api/v2/recipes";
let apikey = "541bce7b-146b-485b-86a7-76c567a2860a";

async function GetRecipes(recipeName,id,isAllshow) {
    let resp = await fetch(`${apiURL}?search=${recipeName}&key=${apikey}`);
    let result = await resp.json();
    console.log(result);
    let Recipes = isAllshow ? result.data.recipes : result.data.recipes.slice(0, 6);
    showRecipes(Recipes, id);
}
function showRecipes(recipes, id) {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        dataType: 'html',
        type: 'POST',
        url: '/Recipe/GetRecipeCard',
        data: JSON.stringify(recipes),
        success: function (htmlResult) {
            $('#' + id).html(htmlResult);
            getAddedCarts();
        },

    });
}
async function getOrderRecipe(id,ShowId) {
   
    let resp = await fetch(`${apiURL}/${id}?key=${apikey}`);
    let result = await resp.json();
    console.log(result);
    let recipe = result.data.recipe;
    showOrderRecipeDetails(recipe, ShowId);


}
function showOrderRecipeDetails(orderRecipeDetails, showId) {
   // console.log(orderRecipeDetails);
    $.ajax({
      //  contentType: "application/json; charset=utf-8",
        url: '/Recipe/ShowOrder',
        data: orderRecipeDetails,
        datatype: 'html',
        type:'POST',
       // data: JSON.stringify(orderRecipeDetails),     
        success: function (htmlResult) {
            $('#' + showId).html(htmlResult);
        },

    });
}

//order page
function quantity(option) {
    let qty = $('#qty').val();
    let price = parseInt($('#price').val());
    let totalAmount = 0;
    if (option === 'inc') {
        qty = parseInt(qty) + 1;
    }
    else {
        qty = qty == 1 ? qty : qty - 1;
        
    }
    totalAmount = price * qty;
    $('#qty').val(qty);
    $('#totalAmount').val(totalAmount)
}

//Add to cart
async function cart() {
    let iTag = $(this).children('i')[0];
    let recipeId = $(this).attr('data-recipeId');
    
    if ($(iTag).hasClass('fa-regular')) {
        let resp = await fetch(`${apiURL}/${recipeId}?key=${apikey}`);
        let result = await resp.json();
       // console.log(result);
        let cart = result.data.recipe;
        cart.recipeId = recipeId;
        delete cart.id;
        // console.log(cart);
        cartRequest(cart, 'SaveCart', 'fa-solid', 'fa-regular', iTag, false);
    } else {
        let data = { Id: recipeId };
        cartRequest(data, 'RemoveCartFromList', 'fa-regular', 'fa-solid', iTag, false);
    }
}

function cartRequest(data, action ,addcls ,removecls,iTag ,isReload) {
  //  console.log(data);
    $.ajax({
        url: '/Cart/' + action,
        type : 'POST',
        data: data,
        success: function (resp) {
            if (isReload) {
                location.reload();
            }
            else {
                $(iTag).addClass(addcls);
                $(iTag).removeClass(removecls);

            }
            //  console.log(resp);
            
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function getAddedCarts() {
    $.ajax({
        url: '/Cart/GetAddedCarts',
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            $('.addToCartIcon').each((index, spanTag) => {
                let recipeId = $(spanTag).attr("data-recipeId");
                for (var i = 0; i < result.length; i++) {
                    if (recipeId == result[i]) {
                        let itag = $(spanTag).children('i')[0];
                        $(itag).addClass('fa-solid');
                        $(itag).removeClass('fa-regular');
                        break;
                    }
                }
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function getCartLsit() {
    $.ajax({
        url: '/Cart/GetCartList',
        type: 'GET',
        dataType: 'html',
        success: function (result) {
            $('#showCartList').html(result);
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function removeCartfromlist(id) {

    let data = { Id: id };
    cartRequest(data, 'RemoveCartFromList', null, null, null,true);
}