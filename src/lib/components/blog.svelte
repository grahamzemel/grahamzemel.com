<script lang="ts">
  import { onMount } from "svelte";
  import Visibility from "$lib/components/visibility.svelte";

  type RssItem = {
    categories: string[];
    title: string;
    link: string;
    thumbnail: string;
    pubDate: string;
    author: string;
  };

  type Metadata = {
    title: string;
    description: string;
    images: string[];
  };

  type BlogPost = {
    title: string;
    link: string;
    date: string;
    creator: string;
    tags: string[];
  };

  let isVisible = false;
  let hasChanged = false;
  let hasObserverSupport = true;

  let posts: BlogPost[] = [];
  let metadata: Metadata = {
    title: "The Gray Area",
    description:
      "For all kinds of developers, hackers, and tech-savvy readers | Now welcoming new writers!",
    images: ["./grayarea.jpg"],
  };

  onMount(async function () {
    // console.log(metadata);

    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area",
    )
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
      })
      .then((data) => {
        const res = data.items as RssItem[]; //This is an array with the content. No feed, no info about author etc..
        posts = res
          .filter((item: RssItem) => item.categories.length > 0)
          .slice(0, 3)
          .map((item: RssItem) => ({
            title: shortenText(String(item.title || ""), 0, 60),
            link: safeHttpUrl(item.link),
            date: String(item.pubDate || "").slice(0, 10),
            creator: String(item.author || "").slice(0, 200),
            tags: item.categories
              .map((category: string) => String(category).toUpperCase())
              .slice(0, 3),
          }));

        function shortenText(
          text: string,
          startingPoint: number,
          maxLength: number,
        ) {
          return text.length > maxLength
            ? text.slice(startingPoint, maxLength) + "..."
            : text;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });

  function safeHttpUrl(value: string) {
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.href;
      }
    } catch {}
    return "https://medium.com/the-gray-area";
  }
</script>

<div class="sm:mt-[12vh] mt-10" aria-hidden="true">
  <Visibility
    bind:hasObserverSupport
    visibilityUpdate={(state) => {
      // Only update one time (once visible)
      if (!hasChanged && state !== false) {
        hasChanged = true;
        isVisible = state;
      }
    }}
  />
</div>

<section
  class="section-band custom-transition {!hasObserverSupport || isVisible
    ? 'opacity-100'
    : 'opacity-0'}"
>
  <h1 class="font-serif font-bold sm:text-6xl text-4xl">The Gray Area</h1>
  <br />
  <h2 class="font-serif font-bold sm:text-3xl text-xl">
    I initially created The Gray Area to provide an educational resource for
    beginner programmers or cybersecurity enthusiasts, but it's since become so
    much more.
  </h2>
  <br />
  <div
    class="block flex space-x-64 justify-center text-center p-4 ml-[1rem]"
    id="statsBig"
  >
    <div>
      <div class="text-5xl font-bold">30+</div>
      <div class="text-2xl text-gray-500">Writers</div>
    </div>
    <div>
      <div class="text-5xl font-bold">2,000,000+</div>
      <div class="text-2xl text-gray-500">Readers</div>
    </div>
    <div>
      <div class="text-5xl font-bold">250+</div>
      <div class="text-2xl text-gray-500">Posts</div>
    </div>
  </div>
  <br />
  <div class="card" style="border-radius: 0.9rem;">
    <a
      href="https://thegrayarea.tech"
      target="_blank"
      rel="noopener noreferrer"
    >
      {#if metadata.images}
        <img
          style="border-top-right-radius: 0.9rem; border-top-left-radius: 0.9rem;"
          src={metadata.images[0]}
          alt={metadata.title}
        />
      {/if}
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
    </a>
  </div>
  <br /><br />

  <div
    id="blog"
    class="blog flex justify-center items-center lg:block md:block hidden"
  >
    <ul class="blog__slider grid grid-cols-3 w-50% lg:w-33%">
      {#if posts.length}
        {#each posts as post}
          <li
            class="blog__post"
            style="text-align:center;justify-content:center;"
          >
            <div class="blog__content">
              <div class="blog_preview">
                <a
                  href={post.link}
                  rel="noopener noreferrer"
                  style="color: lightblue;"
                >
                  <h2
                    class="blog__title"
                    style="font-size: 1.5rem; font-weight:bold;"
                  >
                    {post.title}
                  </h2>
                </a>
                <span class="blog__author">Written by {post.creator}</span>
              </div>
              <div class="blog__info">
                <br />
                <p
                  class="blog__intro"
                  style="color: slategrey;font-weight:thin;"
                >
                  {post.tags.join(", ")}
                </p>
                <span class="blog__date">Published on {post.date}</span>
              </div>
            </div>
          </li>
        {/each}
      {:else}
        <p class="blog__intro">
          Please wait, obtaining posts from
          <a
            href="https://medium.com/the-gray-area"
            aria-label="The Gray Area on Medium">The Gray Area</a
          >
        </p>
      {/if}
    </ul>
  </div>
  <div class="lg:hidden md:hidden block flex justify-between text-center p-4">
    <div>
      <div class="text-3xl font-bold">30+</div>
      <div class="text-lg text-gray-500">Writers</div>
    </div>
    <div>
      <div class="text-3xl font-bold">2,000,000+</div>
      <div class="text-lg text-gray-500">Readers</div>
    </div>
    <div>
      <div class="text-3xl font-bold">250+</div>
      <div class="text-lg text-gray-500">Posts</div>
    </div>
  </div>
</section>

<style lang="postcss">
  @media (max-width: 640px) {
    #statsBig {
      display: none;
    }
  }
  .custom-transition {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1500ms;
  }

  .card {
    display: flex;
    flex-direction: column;
    border-radius: 0.9rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    max-width: 100%;
    padding-top: 2rem;
    margin: 0 auto;
    color: inherit;
  }
  .card img {
    max-height: 300px; /* Adjust the maximum height as needed */
    height: auto; /* Maintain the aspect ratio */
    width: 100%; /* Maintain the full width of the card */
  }
  .card h2 {
    margin: 0;
    padding: 1rem;
    background: rgba(100, 100, 100, 0.7);
    color: white;
    font-size: 1.2rem;
  }
  .card p {
    margin: 0;
    padding: 1rem;
    background: white;
    color: #333;
    font-size: 1rem;
  }
</style>
