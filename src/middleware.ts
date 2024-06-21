import {
  clerkMiddleware,
  createRouteMatcher,
  redirectToSignIn,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/login(.*)"]);

export default clerkMiddleware(
  (auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect();
    }
  },
  { debug: true }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
