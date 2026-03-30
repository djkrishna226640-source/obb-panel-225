import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type Rarity = { #common; #rare; #epic; #legendary };
  type Category = { #technique; #movement; #settings };

  type Bundle = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : Text;
    rarity : Rarity;
  };

  type Sensitivity = {
    id : Nat;
    deviceLabel : Text;
    general : Nat;
    redDot : Nat;
    scope2x : Nat;
    scope4x : Nat;
    awmScope : Nat;
    gyroscope : Nat;
  };

  type HeadshotTip = {
    id : Nat;
    title : Text;
    description : Text;
    category : Category;
    displayOrder : Nat;
  };

  module Bundle {
    public func compare(bundle1 : Bundle, bundle2 : Bundle) : Order.Order {
      Nat.compare(bundle1.id, bundle2.id);
    };
  };

  module Sensitivity {
    public func compare(sens1 : Sensitivity, sens2 : Sensitivity) : Order.Order {
      Nat.compare(sens1.id, sens2.id);
    };
  };

  module HeadshotTip {
    public func compare(tip1 : HeadshotTip, tip2 : HeadshotTip) : Order.Order {
      Nat.compare(tip1.displayOrder, tip2.displayOrder);
    };
  };

  let bundles = Map.empty<Nat, Bundle>();
  let sensitivities = Map.empty<Nat, Sensitivity>();
  let tips = Map.empty<Nat, HeadshotTip>();

  var nextBundleId = 4;
  var nextSensitivityId = 4;
  var nextTipId = 6;

  // Initialize with sample data
  func initialize() {
    let sampleBundles = [
      {
        id = 1;
        name = "Shadow Pack";
        description = "Contains dark-themed outfits and accessories.";
        imageUrl = "shadow_pack.png";
        rarity = #epic;
      },
      {
        id = 2;
        name = "Firestorm Bundle";
        description = "Exclusive fiery skins and weapons.";
        imageUrl = "firestorm_bundle.png";
        rarity = #legendary;
      },
      {
        id = 3;
        name = "Urban Warrior";
        description = "Modern urban combat gear.";
        imageUrl = "urban_warrior.png";
        rarity = #rare;
      },
    ];
    let sampleSensitivities = [
      {
        id = 1;
        deviceLabel = "Samsung S21";
        general = 80;
        redDot = 90;
        scope2x = 70;
        scope4x = 65;
        awmScope = 50;
        gyroscope = 100;
      },
      {
        id = 2;
        deviceLabel = "iPhone 12";
        general = 75;
        redDot = 85;
        scope2x = 60;
        scope4x = 55;
        awmScope = 45;
        gyroscope = 90;
      },
      {
        id = 3;
        deviceLabel = "OnePlus 9";
        general = 70;
        redDot = 80;
        scope2x = 55;
        scope4x = 50;
        awmScope = 40;
        gyroscope = 85;
      },
    ];
    let sampleTips = [
      {
        id = 1;
        title = "Aim for the Head";
        description = "Always aim at the head for maximum damage.";
        category = #technique;
        displayOrder = 1;
      },
      {
        id = 2;
        title = "Use Red Dot Effectively";
        description = "Adjust red dot sensitivity for better accuracy.";
        category = #settings;
        displayOrder = 2;
      },
      {
        id = 3;
        title = "Keep Moving";
        description = "Constant movement makes you a harder target.";
        category = #movement;
        displayOrder = 3;
      },
      {
        id = 4;
        title = "Practice Flicks";
        description = "Improve your reflex shots with practice.";
        category = #technique;
        displayOrder = 4;
      },
      {
        id = 5;
        title = "Optimize Gyroscope";
        description = "Use gyroscope for faster target acquisition.";
        category = #settings;
        displayOrder = 5;
      },
    ];

    sampleBundles.forEach(func(b) { bundles.add(b.id, b) });
    sampleSensitivities.forEach(
      func(s) { sensitivities.add(s.id, s) },
    );
    sampleTips.forEach(func(t) { tips.add(t.id, t) });
  };

  initialize();

  public shared ({ caller }) func addBundle(name : Text, description : Text, imageUrl : Text, rarity : Rarity) : async Bundle {
    let bundle : Bundle = {
      id = nextBundleId;
      name;
      description;
      imageUrl;
      rarity;
    };
    bundles.add(nextBundleId, bundle);
    nextBundleId += 1;
    bundle;
  };

  public shared ({ caller }) func updateBundle(id : Nat, name : Text, description : Text, imageUrl : Text, rarity : Rarity) : async Bundle {
    if (not bundles.containsKey(id)) { Runtime.trap("Bundle not found") };
    let updatedBundle : Bundle = {
      id;
      name;
      description;
      imageUrl;
      rarity;
    };
    bundles.add(id, updatedBundle);
    updatedBundle;
  };

  public shared ({ caller }) func deleteBundle(id : Nat) : async () {
    if (not bundles.containsKey(id)) { Runtime.trap("Bundle not found") };
    bundles.remove(id);
  };

  public query ({ caller }) func getBundles() : async [Bundle] {
    bundles.values().toArray().sort();
  };

  public query ({ caller }) func getBundle(id : Nat) : async Bundle {
    switch (bundles.get(id)) {
      case (null) { Runtime.trap("Bundle not found") };
      case (?bundle) { bundle };
    };
  };

  public shared ({ caller }) func addSensitivity(deviceLabel : Text, general : Nat, redDot : Nat, scope2x : Nat, scope4x : Nat, awmScope : Nat, gyroscope : Nat) : async Sensitivity {
    let sensitivity : Sensitivity = {
      id = nextSensitivityId;
      deviceLabel;
      general;
      redDot;
      scope2x;
      scope4x;
      awmScope;
      gyroscope;
    };
    sensitivities.add(nextSensitivityId, sensitivity);
    nextSensitivityId += 1;
    sensitivity;
  };

  public shared ({ caller }) func updateSensitivity(id : Nat, deviceLabel : Text, general : Nat, redDot : Nat, scope2x : Nat, scope4x : Nat, awmScope : Nat, gyroscope : Nat) : async Sensitivity {
    if (not sensitivities.containsKey(id)) { Runtime.trap("Sensitivity not found") };
    let updatedSensitivity : Sensitivity = {
      id;
      deviceLabel;
      general;
      redDot;
      scope2x;
      scope4x;
      awmScope;
      gyroscope;
    };
    sensitivities.add(id, updatedSensitivity);
    updatedSensitivity;
  };

  public shared ({ caller }) func deleteSensitivity(id : Nat) : async () {
    if (not sensitivities.containsKey(id)) { Runtime.trap("Sensitivity not found") };
    sensitivities.remove(id);
  };

  public query ({ caller }) func getSensitivities() : async [Sensitivity] {
    sensitivities.values().toArray().sort();
  };

  public shared ({ caller }) func addTip(title : Text, description : Text, category : Category, displayOrder : Nat) : async HeadshotTip {
    let tip : HeadshotTip = {
      id = nextTipId;
      title;
      description;
      category;
      displayOrder;
    };
    tips.add(nextTipId, tip);
    nextTipId += 1;
    tip;
  };

  public shared ({ caller }) func updateTip(id : Nat, title : Text, description : Text, category : Category, displayOrder : Nat) : async HeadshotTip {
    if (not tips.containsKey(id)) { Runtime.trap("Tip not found") };
    let updatedTip : HeadshotTip = {
      id;
      title;
      description;
      category;
      displayOrder;
    };
    tips.add(id, updatedTip);
    updatedTip;
  };

  public shared ({ caller }) func deleteTip(id : Nat) : async () {
    if (not tips.containsKey(id)) { Runtime.trap("Tip not found") };
    tips.remove(id);
  };

  public query ({ caller }) func getTips() : async [HeadshotTip] {
    tips.values().toArray().sort();
  };

  public query ({ caller }) func checkAdminPassword(password : Text) : async Bool {
    password == "225";
  };

  public query ({ caller }) func getStats() : async {
    bundleCount : Nat;
    sensitivityCount : Nat;
    tipCount : Nat;
  } {
    {
      bundleCount = bundles.size();
      sensitivityCount = sensitivities.size();
      tipCount = tips.size();
    };
  };
};
