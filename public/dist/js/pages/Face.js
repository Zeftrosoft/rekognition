var face_data = []
var default_face = {
  img_path: "",
  day: 0,
  month:0,
  year :0,
  hour :0,
  min :0,
  isMatched:false,
  matched_name:"",
  similarity:0,
  confidance:0,
  _id: ""
}


var itemTableId = "#itemlistTable"
var itemModelId = "#item-modal"
var itemLID = "#item_lid" 
var itemName = "#item_name"
var itemmodelId ="#item_modelid"
var itemProcessorId = "#item_processorid"
var itemRamId = "#item_ramid"
var itemhddStorageId = "#item_hddstorageid"
var itemssdStorageId = "#item_ssdstorageid"
var itemScreenId = "#itrm_screenid"
var itemVendorId = "#item_vendorid"
var itemTypeId = "#item_itemtypeid"
var itemIsWebsiteUploaded = "#item_iswebsiteuploaded"
var purchaseDate = "#item_purchaseDate"
var itemDbId = "#item_id"
var itemModalTitle = "#item-modal-title"

function getItemData(querry) {
  $.ajax({
    cache: false,
    type: 'GET',
    url: getItemUrl()+'/all',
    xhrFields: {
        // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
        // This can be used to set the 'withCredentials' property.
        // Set the value to 'true' if you'd like to pass cookies to the server.
        // If this is enabled, your server must respond with the header
        // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
    },
    success: function (json) {
        if (!json.status) {
          console.error('Serverside Error While Geting Items');
          console.error(json.message)
        }
        else {
          item_data = json.details
          initItemList()
        }
    },
    error: function (data) {
        console.log("Error While Getting Items");
        console.log(data);
    }
  });
}

function getAllItemDetails() {
  getItemData()
}


function initItemList() {
  console.log('Item Data');
  console.log(item_data);
  $(itemTableId).html('')
  var list = []
  $.each(item_data, function (indx, row) {
    var html = `
    <li class="item">
        <div class="product-img">
          <img src="/dist/img/user1-128x128.jpg" alt="Product Image" class="img-size-50">
        </div>
        <div class="product-info">
            <span style="color:red">${row.lid}</span> |
            <span style="color:green">${row.condition}</span> 
            <i class="far fa-calendar-alt"></i>
            <span style="color:fuchsia">${(row.purchase_year+'-'+row.purchase_month+'-'+row.purchase_day)}</span>
            <td class="project-actions text-right">
            <a class="btn btn-primary btn-sm float-right"  href="#">
                <i class="fas fa-folder">
                </i>
                View
            </a>
            <a class="btn btn-info btn-sm float-right" href="/items/form/${row._id}" style="margin-right: 0.5em" >
                <i class="fas fa-pencil-alt"></i>
                Edit
            </a>
        </td> 
          <span class="product-description">
          ${row.name} 
          ${row.screen[0].size} 
          ${row.model[0].name} 
          <span style="color:#fd7e14">${'RAM'+'-'+row.ram[0].size +'-'+row.ram[0].type} </span>  
          <span style="color:#6610f2">${'hdd'+'-'+row.hdd[0].size}</span> 
          <span style="color:#0e5fb5">${'ssd'+'-'+row.ssd[0].size} </span> 
          ${row.itemtype[0].name} 
        </div>
      </li>
    `             
    list.push(html)
  })
  $(itemTableId).html(list)
} 

function editItem(data) {
  console.log('Edit Item');
  console.log(data);
  
  var row = $.grep(item_data, function (n,i) {
    return n._id == data
  })
  console.log('After Search');
  console.log(row);
  
  if(row.length > 0) {
    setItemFormValues(row[0])
    $(itemModalTitle).text('Edit Item')
    $(itemModelId).modal('show')
  } else {
    console.log('Item Row Not Found')
  }
}
