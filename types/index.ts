interface Photo {
  type:
    | "bathroom"
    | "bedroom"
    | "dining_room"
    | "exterior"
    | "kitchen"
    | "living_room"
    | "other"
    | undefined;
  name: string;
  file: Blob | File | undefined;
  id: string;
}

class Photo implements Photo {
  constructor({
    type,
    name,
    file,
    id,
  }: {
    type: Photo["type"];
    name: Photo["name"];
    file: Photo["file"];
    id: Photo["id"];
  }) {
    this.type = type;
    this.name = name;
    this.file = file;
    this.id = id;
  }

  static getTypeAsString(type: Photo["type"]): string {
    switch (type) {
      case "bathroom":
        return "Bathroom";
      case "bedroom":
        return "Bedroom";
      case "dining_room":
        return "Dining Room";
      case "exterior":
        return "Exterior";
      case "kitchen":
        return "Kitchen";
      case "living_room":
        return "Living Room";
      case "other":
        return "Other";
      default:
        return "Unknown";
    }
  }

  static getColorFromType(type: Photo["type"]): {
    backgroundColor: string;
    textColor: string;
  } {
    const opacity = "0.7"; // modify opacity as desired
    switch (type) {
      case "bathroom":
        return {
          backgroundColor: `rgba(244, 67, 54, ${opacity})`,
          textColor: "#fff",
        };
      case "bedroom":
        return {
          backgroundColor: `rgba(33, 150, 243, ${opacity})`,
          textColor: "#fff",
        };
      case "dining_room":
        return {
          backgroundColor: `rgba(76, 175, 80, ${opacity})`,
          textColor: "#fff",
        };
      case "exterior":
        return {
          backgroundColor: `rgba(255, 152, 0, ${opacity})`,
          textColor: "#fff",
        };
      case "kitchen":
        return {
          backgroundColor: `rgba(156, 39, 176, ${opacity})`,
          textColor: "#fff",
        };
      case "living_room":
        return {
          backgroundColor: `rgba(0, 188, 212, ${opacity})`,
          textColor: "#fff",
        };
      case "other":
        return {
          backgroundColor: `rgba(158, 158, 158, ${opacity})`,
          textColor: "#fff",
        };
      default:
        return {
          backgroundColor: `rgba(158, 158, 158, ${opacity})`,
          textColor: "#fff",
        };
    }
  }
}

export { Photo };
