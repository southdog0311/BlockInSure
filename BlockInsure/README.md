# BlockInsure (保鏈安全)

## 智能合約各項函式介紹
* policyCounter: 目前有幾個保險單
* policies: 輸入想看的ID，查看保險單的各項屬性
    * policyId(保險單ID)
    * carOwner(購買保險的使用者 address)
    * premiumAmount
    * coverageAmount
    * purchaseTimestamp(建立保單的時間蹉記)
    * expirationTimestamp(保單時效)
    * isClaimed(出險狀態)
    * isPremiumPaid(保險費付費狀態)
* owner: 購買保險的使用者 address
* purchaseInsurance(建立保單) 
    * premiumAmount(保險費，投保要付的金額)
    * coverageAmount(保險金額，也就是理賠金額)
    * durationInMonths(保險時間)
* processPremiumAmount(付款投保)
    * 這邊為使用者購買保險的步驟(所以要付費給合約，注意這邊要 match 剛剛設定的保險費)
    * policyId(保險單ID)
* fileClaim(出險)
    * policyId(想要出險的保險單ID)
    * claimAmount(想要拿的金額，但這邊不得高於合約內的現有金額)

這邊我有加入以下程式碼讓合約可以收外來的 ether，因為這樣要測試出險的時候，合約內才有夠錢可以用(先自己手動匯一些給合約用)
```solidity=
receive() external payable {
    // Handle the incoming Ether
}

```