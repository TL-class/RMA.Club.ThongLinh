import logger from "debug";
import { useSceneStore } from "~/store/scene";
import { usePropertyStore } from "~/store/property";

//debug
const debug = logger("travvir:debut-nuxt:composables:useTourAccess");

const KANRI_TOKEN_KEY = "kanri_token";

// state
const password = ref("");
const propertyId = ref(null);
const passwordError = ref("");
const privateAuthError = ref("");
let listenersAttached = false;
const isTourUnlocked = ref(false);
const needsPrivateAuth = ref(false);
const isSubmittingPassword = ref(false);
const isAwaitingPrivateAuth = ref(false);

function getKanriToken() {
  if (typeof window === "undefined" || !window.localStorage) return "";
  return localStorage.getItem(KANRI_TOKEN_KEY) || "";
}

export const useTourAccess = () => {
  const sceneStore = useSceneStore();
  const { $busSocket } = useNuxtApp();
  const busSocket = inject("busSocket");
  const propertyStore = usePropertyStore();
  const config = useRuntimeConfig();

  const isPasswordProtected = computed(
    () => propertyStore.propertyInfo?.visibility === "protected",
  );

  const isPrivatePlace = computed(
    () => propertyStore.propertyInfo?.visibility === "private",
  );

  const isPlacePasswordProtected = computed(
    () =>
      isPasswordProtected.value &&
      !isTourUnlocked.value &&
      !!propertyStore.propertyInfo?.id,
  );

  const isPlacePrivateProtected = computed(
    () =>
      isPrivatePlace.value &&
      needsPrivateAuth.value &&
      !isTourUnlocked.value &&
      !!propertyStore.propertyInfo?.id,
  );

  function handleError(error) {
    if (error?.code === "INCORRECT_PASSWORD") {
      passwordError.value = "Wrong password";
      isSubmittingPassword.value = false;
      return;
    }

    if (
      isPrivatePlace.value &&
      (isAwaitingPrivateAuth.value || needsPrivateAuth.value)
    ) {
      privateAuthError.value = "Invalid credentials";
      needsPrivateAuth.value = true;
      isAwaitingPrivateAuth.value = false;
    }
  }

  function handleTourResponse(tour) {
    debug("TourData", tour);

    const scenes = tour?.scenes;
    if (tour && Array.isArray(scenes)) {
      sceneStore.setSceneList(scenes);
      isTourUnlocked.value = true;
      passwordError.value = "";
      privateAuthError.value = "";
      needsPrivateAuth.value = false;
      isSubmittingPassword.value = false;
      isAwaitingPrivateAuth.value = false;
    }
  }

  function attachListeners() {
    if (listenersAttached || !busSocket) return;
    busSocket.on("error", handleError);
    busSocket.on("TOUR", handleTourResponse);
    listenersAttached = true;
  }

  function resetGateState() {
    password.value = "";
    passwordError.value = "";
    privateAuthError.value = "";
    isTourUnlocked.value = false;
    needsPrivateAuth.value = false;
    isSubmittingPassword.value = false;
    isAwaitingPrivateAuth.value = false;
  }

  function handlePrivateTour(propertyId) {
    const kanriToken = getKanriToken();
    if (!kanriToken) {
      needsPrivateAuth.value = true;
      return;
    }
    isAwaitingPrivateAuth.value = true;
    privateAuthError.value = "";
    $busSocket.getTour(propertyId, undefined, kanriToken);
  }

  const initTourAccess = async (id) => {
    try {
      if (!id) return;

      if (propertyId.value !== id) {
        resetGateState();
      }
      propertyId.value = id;
      attachListeners();

      if (isPrivatePlace.value) {
        handlePrivateTour(id);
        return;
      }

      if (!isPasswordProtected.value) {
        $busSocket.getTour(id);
      }
    } catch (error) {
      debug("Error initializing tour access", error);
    }
  };

  const handlePasswordSubmit = (submittedPassword) => {
    const pw =
      typeof submittedPassword === "string"
        ? submittedPassword.trim()
        : password.value.trim();

    if (!propertyId.value || !pw || isSubmittingPassword.value) return;

    password.value = pw;
    passwordError.value = "";
    isSubmittingPassword.value = true;
    $busSocket.getTour(propertyId.value, pw);
  };

  const clearPasswordError = () => {
    passwordError.value = "";
  };

  const clearPrivateAuthError = () => {
    privateAuthError.value = "";
  };

  const handlePrivateSignIn = () => {
    clearPrivateAuthError();
    const loginBase = config.public.NUXT_BASE_URL || "";
    const returnTo = encodeURIComponent(window.location.href);

    const loginUrl = `${loginBase}/app/auth/login${
      returnTo ? `?redirect=${returnTo}` : ""
    }`;
    window.location.href = loginUrl;
  };

  return {
    password,
    passwordError,
    privateAuthError,
    isTourUnlocked,
    isSubmittingPassword,
    isAwaitingPrivateAuth,
    isPlacePasswordProtected,
    isPlacePrivateProtected,
    initTourAccess,
    handlePasswordSubmit,
    clearPasswordError,
    clearPrivateAuthError,
    handlePrivateSignIn,
  };
};
