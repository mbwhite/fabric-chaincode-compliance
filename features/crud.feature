# features/bank-account.feature
Feature: CRUD Shim APIs

  Scenario: Put state APIs
    Given The network has been started
    And The channel and 'basic' chaincode has been deployed
    And I have created an uuid called 'anid'
    And I submit a transaction 'createMyAsset' with arguments '["<anid>","bond"]'
    Then The result should be succesful

  Scenario: Put state APIs
    Given The network has been started
    And The channel and chaincode has been deployed
    And I submit a transaction 'createMyAsset' with arguments '["014","bond"]'
    And I submit a transaction 'createMyAsset' with arguments '["014","bond"]'
    Then The result should be failure