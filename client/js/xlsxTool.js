function getCellValue(wb,sheetIdx,cellAddr){
  var ws = wb.Sheets[wb.SheetNames[sheetIdx]];
  var desired_cell = ws[cellAddr];
  return desired_cell?desired_cell.v:undefined;
}

function getItemInfo(wb){
  
  let productNum = getCellValue(wb,0,'A7')
//   console.log(productNum[16])
  let tempSplit = productNum[16];

//   let tempSplit = "："
  productNum = productNum.split(tempSplit)
  console.log(productNum)
  productNum = productNum[1]
  
  let preparer = getCellValue(wb,0,'E7')
  preparer = preparer.split(":")
  preparer = preparer[1]
  
  let dt = getCellValue(wb,0,'H7');
  dt = (dt-1) * 8.64e7 -2208960000000
  
  let productName = getCellValue(wb,0,'A8')
  productName = productName.split(tempSplit)
  productName = productName[1]
  
  let rev = getCellValue(wb,0,'H8')
  
  let customer = getCellValue(wb,0,'A9')
  customer = customer.split(tempSplit)
  customer = customer[1]
  
  let verifier = getCellValue(wb,0,'E9')
  verifier = verifier.split(tempSplit)
  verifier = verifier[1]
  
  let pageNum = getCellValue(wb,0,'H9')
  
  
  //part info saver
  
  let rowNum = 12;
  let seqNoNumber = 0;
  let currentUsage = "";
  let maxSeqNoNumber = 5;
  
  let partNumSet = new Set();
  let partInfoSet = [];
  while(seqNoNumber <= maxSeqNoNumber){
    let item = getCellValue(wb,0,'A'+rowNum);
    // console.log(item)
    if(typeof item !== "number"){
      seqNoNumber += 1
      rowNum += 1;
      continue
    }else{
      seqNoNumber = 0
    }
    
    let level = getCellValue(wb,0,'B'+rowNum);
    
    let usage = getCellValue(wb,0,'C'+rowNum);
    if(usage) currentUsage = usage;
    
    let partName = getCellValue(wb,0,'D'+rowNum);
    
    let partNum = "000" + item.toString()
    partNum = productNum + '-' + partNum.slice(-3)
    partNumSet.add(partNum);
    
    let mtlSpec = getCellValue(wb,0,'E' + rowNum);
    
    let unit = getCellValue(wb,0,'F' + rowNum);
    
    let qty = getCellValue(wb,0,'G' + rowNum)
    
    let vendor = getCellValue(wb,0,'H' + rowNum)
    
    let remark = getCellValue(wb,0,'I' + rowNum)
    
    partInfoSet.push({
      "Product Item Id" : productNum,
      "Product Name": productName,
      "Prepare by": preparer,
      "Date": dt,
      "Rev": rev,
      "Customer": customer,
      "Verify by": verifier,
      "Page": pageNum,
      
      "Part Number": partNum,
      "Item": item,
      "Level": level,
      "Usage": currentUsage,
      "Part Name": partName,
      "Mtl Specification": mtlSpec,
      "Unit": unit,
      "Q\'ty\/Set": qty,
      "Vendor": vendor,
      "Remark": remark
    })
    
    rowNum += 1;
  }
  
  let currentItem = {
    "Product Item Id" : productNum,
    "Product Name": productName,
    "Prepare by": preparer,
    "Date": dt,
    "Rev": rev,
    "Customer": customer,
    "Verify by": verifier,
    "Page": pageNum,
    "Part Number Set": partNumSet
  }
  
  console.log(partInfoSet);
  console.log(currentItem)
  
}