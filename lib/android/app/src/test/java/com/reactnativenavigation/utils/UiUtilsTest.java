package com.reactnativenavigation.utils;

import android.view.*;

import com.reactnativenavigation.*;

import org.junit.*;

import static org.mockito.Mockito.*;

@Ignore("New architecture - WIP")
public class UiUtilsTest extends BaseTest {
    @Test
    public void runOnPreDrawOnce() {
        View view = new View(newActivity());
        Runnable task = mock(Runnable.class);
        verifyNoInteractions(task);

        UiUtils.runOnPreDrawOnce(view, task);
        dispatchPreDraw(view);
        verify(task, times(1)).run();
    }
}
