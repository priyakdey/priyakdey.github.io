from typing import List


class Solution:
    def rob(self, nums: List[int]) -> int:
        if nums is None or len(nums) == 0:
            raise Exception("Invalid arguments")

        if len(nums) == 1:
            return nums[0]
        # 2 houses, can just loot either of the two
        if len(nums) == 2:
            return max(nums[0], nums[1])

        # recursive solution
        # return self.rob_rec(nums, 0)

        # recursive solution with memoization
        # cache: List[int] = [-1 for _ in nums]
        # return self.rob_rec_memo(nums, 0, cache)

        # tabulation
        # return self.rob_tab(nums)

        # tabulation with space optimization
        return self.rob_tab_with_space_optimization(nums)

    def rob_tab_with_space_optimization(self, nums: List[int]) -> int:
        """Bottom up approach- Tabulation without the extra space"""

        non_adjacent_max_loot, adjacent_max_loot = nums[-1], nums[-2]

        for curr_index in range(len(nums) - 3, -1, -1):
            curr_loot = nums[curr_index] + non_adjacent_max_loot
            non_adjacent_max_loot = max(non_adjacent_max_loot, adjacent_max_loot)
            adjacent_max_loot = curr_loot

        return max(non_adjacent_max_loot, adjacent_max_loot)

    def rob_tab(self, nums: List[int]) -> int:
        """Bottom up approach- Tabulation"""

        max_loot: List[int] = [-1 for _ in nums]
        max_loot[-1] = nums[-1]
        max_loot[-2] = nums[-2]

        prev_max_loot = max_loot[-1]  # for house_-3, we can only loot house_-1

        for curr_index in range(len(nums) - 3, -1, -1):
            curr_loot = nums[curr_index] + prev_max_loot
            max_loot[curr_index] = curr_loot
            # sliding window to avoid O(n) operation to find next max
            prev_max_loot = max(max_loot[curr_index + 1], prev_max_loot)

        return max(max_loot[0], max_loot[1])

    def rob_rec_memo(self, nums: List[int], curr_index, cache: List[int]) -> int:
        """Recursive approach with memoization"""

        if curr_index >= len(nums):
            return 0
        if curr_index == len(nums) - 2 or curr_index == len(nums) - 1:
            return nums[curr_index]

        if cache[curr_index] != -1:
            # result for this index has been calculated, return from cache
            return cache[curr_index]

        max_loot = self.rob_rec_memo(nums, curr_index + 1, cache)

        for next_index in range(curr_index + 2, len(nums)):
            max_loot = max(
                max_loot, nums[curr_index] + self.rob_rec_memo(nums, next_index, cache)
            )

        # cache the max loot at curr_index for later computations
        cache[curr_index] = max_loot
        return max_loot

    def rob_rec(self, nums: List[int], curr_index: int) -> int:
        """Recursive approach"""

        # Guard against overshooting the array boundary and potential stackoverflow
        if curr_index >= len(nums):
            return 0

        # BASE CASE: When looting the last or second last house, there
        # are no more options to loot in the right. Refer to decision tree.
        if curr_index == len(nums) - 2 or curr_index == len(nums) - 1:
            return nums[curr_index]

        # do not loot this house and move on to the next house
        max_loot = self.rob_rec(nums, curr_index + 1)

        # consider looting current house
        for next_index in range(curr_index + 2, len(nums)):
            max_loot = max(max_loot, nums[curr_index] + self.rob_rec(nums, next_index))

        return max_loot


solution = Solution()


def assert_test(nums: List[int], expected: int) -> None:
    actual = solution.rob(nums)
    assert actual == expected, f"expected {expected} but got {actual}"


if __name__ == "__main__":
    for nums, expected in ([1, 2, 3, 1], 4), ([2, 7, 9, 3, 1], 12):
        assert_test(nums, expected)
