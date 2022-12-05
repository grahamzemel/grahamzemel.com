<script>
  import SocialIcons from '@rodneylab/svelte-social-icons'
  import ThemeToggle from '../../routes/ThemeToggle.svelte'
  export let sidebar = false;
</script>


<aside class="absolute w-[90%] h-full top-0 bg-[#fcfcfc] dark:bg-[#151515] shadow-lg !pt-[5rem] sidenav" class:sidebar>
  <div class="absolute h-full top-0 left-20 pl-[1rem] bg-gradient-to-r dark:from-[#151515] dark:to-[#0d0d0d]"></div>
  <div class="flex flex-col justify-between items-center">
    <a
    href="https://blog.grahamzemel.com/"
    aria-label="Graham Zemel's Blog"
    class="opacity-75 duration-500 hover:opacity-100 pt-[10%] pb-[20%]"
  >
  <!-- Implement better buttons -->
  <!-- <button class="pushable">
    <span class="front"> -->
    <SocialIcons network="medium" fgColor="#ffffff"  />
    <!-- </span>
    </button> -->
  </a>
  <a
    href="https://github.com/grahamzemel"
    aria-label="Graham Zemel's Github Profile"
    class="opacity-75 duration-500 hover:opacity-100 pt-[10%] pb-[20%]"
  >
    <SocialIcons network="github" fgColor="#ffffff" />
  </a>
  <a
    href="https://store.grahamzemel.com"
    aria-label="Graham Zemel's Gumroad Store"
    class="opacity-75 duration-500 hover:opacity-100 pt-[10%] pb-[20%]"
  >
    <SocialIcons network="itch.io" bgColor="#808080" fgColor="#ffffff" />
  </a>
  <a
    href="https://twitter.com/grahamzemel"
    aria-label="Graham Zemel's Twitter Profile"
    class="opacity-75 duration-500 hover:opacity-100 pt-[10%] pb-[20%]"
  >
    <SocialIcons network="twitter" fgColor="#ffffff" />
  </a>
  <a
    href="https://www.linkedin.com/in/grahamzemel"
    aria-label="Graham Zemel's LinkedIn Profile"
    class="opacity-75 duration-500 hover:opacity-100 pt-[10%] pb-[20%]"
  >
    <SocialIcons network="linkedin" fgColor="#ffffff" />
  </a>
  <h2 class="absolute top-[65%]">
    <ThemeToggle />
  </h2>
  <p
    class="absolute bottom-10 z-0 text-[#4b5563] dark:text-white"
  >
    ©
  </p>
  <p class="pb-[2rem]" />
  <p
    class="absolute bottom-10 pb-[2rem] lg:pb-[4.5rem] z-10 flex justify-center items-center opacity-0 z-10 duration-300 hover:opacity-[1] text-[#4b5563] dark:text-white !text-[10px] lg:text-[15px]"
  >
    Graham Zemel 2022
  </p>
  </div>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out
	}
	.sidebar {
		left: 0
	}
  .pushable {
    background: rgb(110, 110, 110);
    border-radius: 12px;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
  }
  .front {
    display: block;
    border-radius: 12px;
    font-size: 1.25rem;
    background: #333332;
    color: white;
    transform: translateY(-6px);
  }

  .pushable:active .front {
    transform: translateY(-2px);
  }
</style>