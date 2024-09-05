export const NO_MODE: number = -1;
export const OBJECT_DETECTION_MODE: number = 0;
export const OBJ_DETECTION_MODE: number = 0;
export const FACE_DETECTION_MODE: number = 1;
export const GESTURE_RECOGNITION_MODE: number = 2;
export const FACE_LANDMARK_DETECTION_MODE: number = 3;
export const POSE_RECOGNITION_MODE: number = 4;

export const CONFIG_SLIDER_STEP: number = 0.2;

export const VISION_URL: string =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm";

export type InterfaceDelegate = "CPU" | "GPU";
export const DELEGATE_GPU: InterfaceDelegate = "GPU";
export const DELEGATE_CPU: InterfaceDelegate = "CPU";

export type RunningMode = "IMAGE" | "VIDEO";
export const RUNNING_MODE_IMAGE: RunningMode = "IMAGE";
export const RUNNING_MODE_VIDEO: RunningMode = "VIDEO";

export const OBJECT_DETECTION_STR: string = "Object Detection";
export const FACE_DETECTION_STR: string = "Face Detection";
export const GESTURE_RECOGNITION_STR: string = "Gesture Recognition";
export const FACE_LANDMARK_DETECTION_STR: string = "Face Landmark Detection";
export const POSE_RECOGNITION_STR = "Pose Recognition";

export const VIDEO_INPUT: string = "videoinput";

export type ModelLoadResult = {
    modelName: string;
    mode: number;
    loadResult: boolean;
};


// Add these new constants

// Update the ModelMode type to include pose recognition
export type ModelMode =
    | typeof OBJECT_DETECTION_MODE
    | typeof GESTURE_RECOGNITION_MODE
    | typeof FACE_DETECTION_MODE
    | typeof POSE_RECOGNITION_MODE;

// Update the ModelName type to include pose recognition
export type ModelName =
    | typeof OBJECT_DETECTION_STR
    | typeof GESTURE_RECOGNITION_STR
    | typeof FACE_DETECTION_STR
    | typeof POSE_RECOGNITION_STR;

// If you have an enum or union type for different recognition modes, add pose recognition to it
export type RecognitionMode =
    | "object_detection"
    | "gesture_recognition"
    | "face_detection"
    | "pose_recognition";

// If you have any specific types or interfaces for pose recognition, add them here
export interface PoseRecognitionConfig {
    numPoses: number;
    minPoseDetectionConfidence: number;
    minPosePresenceConfidence: number;
    minTrackingConfidence: number;
    // Add any other configuration options specific to pose recognition
}

export const CAMERA_LOAD_STATUS_SUCCESS = 1;
export const CAMERA_LOAD_STATUS_ERROR = 2;
export const CAMERA_LOAD_STATUS_NO_DEVICES = 3;
export type CameraDeviceStatus = {
    status: number | undefined;
    errorMsg: string | undefined;
    errorName: string | undefined;
};

export type CameraDeviceContext = {
    status: CameraDeviceStatus;
    webcamList: MediaDeviceInfo[];
    webcamId: string | undefined;
    setWebcamId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const ERROR_ENABLE_CAMERA_PERMISSION_MSG =
    "Please Enable Camera Permission";
export const ERROR_NO_CAMERA_DEVICE_AVAILABLE_MSG =
    "No Camera Device Available";

// Add these new constants
export const POSE_RECOGNITION_MEDIAPIPE = 0;
export const POSE_RECOGNITION_YOLO = 1;


// Add a new type for pose model selection
export type PoseModelType = typeof POSE_RECOGNITION_MEDIAPIPE | typeof POSE_RECOGNITION_YOLO;

